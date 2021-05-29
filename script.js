Survey.StylesManager.applyTheme("modern");

let questions = [
    "I am often confused about what emotion I am feeling.", 
    "It is difficult for me to find the right words for my feelings.",
    "I have physical sensations that even doctors don’t understand.",
    "I am able to describe my feelings easily.",
    "I prefer to analyze problems rather than just describe them.",
    "When I am upset. I don’t know if I am sad, frightened, or angry.",
    "I am often puzzled by sensations in my body.",
    "I prefer to just let things happen rather than to understand why they turned out that way.",
    "I have feelings that I can’t quite identify.",
    "Being in touch with emotions is essential.",
    "I find it hard to describe how I feel about people.",
    "People tell me to describe my feelings more.",
    "I don’t know what’s going on inside me.",
    "I often don’t know why I am angry.",
    "I prefer talking to people about their daily activities rather than their feelings.",
    "I prefer to watch “light” entertainment shows rather than psychological dramas.",
    "It is difficult for me to reveal my innermost feelings. even to close friends.",
    "I can feel close to someone, even in moments of silence.",
    "I find examination of my feelings useful in solving personal problems.",
    "I look for hidden meanings in movies or plays."
];

let ratings = questions.map(q => { return {
    type: "rating",
    name: q,
    minRateDescription: "Strongly Disagree",
    maxRateDescription: "Strongly Agree",
    // isRequired: true
}});

var surveyJSON = {
    "pages": [{
        "name": "page1",
        "elements": [
            {
                "type": "html",
                "name": "TAS-20",
                "html": `
                    <h2>TAS-20</h2>
                    Please use this scale for the following questions: 
                        <ol>
                            <li>Strongly Disagree</li>
                            <li>Disagree</li>
                            <li>Neither Agree nor Disagree</li>
                            <li>Agree</li>
                            <li>Strongly Agree</li>
                        </ol>
                    `
            }
        ].concat(ratings)
    }],
    "showCompletedPage": false,
}

var survey = new Survey.Model(surveyJSON);
survey.onComplete.add(function(result, options) {
    console.log(result.data);
    let answers = questions.map(q => result.data[q]);
    for (let i of [4, 5, 10, 18, 19]) {
        answers[i-1] = 6 - answers[i-1];
    }
    console.log(answers);
    let reducer = (acc, i) => answers[i-1] + acc;
    let total = answers.reduce((acc, val) => acc + val);
    let dif = [1, 3, 6, 7, 9, 13, 14].reduce(reducer, 0) / 7;
    let ddf = [2, 4, 11, 12, 17].reduce(reducer, 0) / 5;
    let eot = [5, 8, 10, 15, 16, 18, 19, 20].reduce(reducer, 0) / 8;
    let totalMsg = "";
    if (total <= 51) {
        totalMsg = "non-Alexithymia"
    } else if (total <= 60) {
        totalMsg = "possible Alexithymia"
    } else {
        totalMsg = "Alexithymia"
    }
    let res = document.querySelector("#surveyResult");
    res.hidden = false;
    res.innerHTML = `
        I'm assuming you already have some sense of what Alexithymia is - if not, <a href="https://en.wikipedia.org/wiki/Alexithymia">go read Wikipedia</a>. 
        Only the finest scholarly research here.
        <br/> <br/>
        Your total score is ${total} - that suggests ${totalMsg}. The score cutoffs are:
        <ul>
            <li>< 51: Non-Alexithymia</li>
            <li>52-60: Possible Alexithymia</li>
            <li>61+: Alexithymia</li>
        </ul>
        Your subscale scores are:
        <ul>
            <li>Difficulty Identifying Feelings (DIF): ${dif}</li>
            <li>Difficulty Describing Feelings (DDF): ${ddf}</li> 
            <li>Externally-Oriented Thinking (EOT): ${eot}</li>
        </ul>
        But none of this is authoritative. Although there's some evidence that the TAS-20 still works digitally (doi: 10.1037/a0034316), 
        this is a random quiz on the interwebz, and should not be taken too seriously. 
        <br/> <br/>
        If you're concerned and able, I recommend speaking with a therapist. 
        Unfortunately, there isn't much material on Alexithymia outside of academic literature. 
        `;
});
$("#surveyContainer").Survey({
    model: survey
});
