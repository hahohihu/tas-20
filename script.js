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
    isRequired: true
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

function htmlEntities(str) {
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function src(str) {
    return `<a href="${htmlEntities(str)}">(src)</a>`;
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
    let res = document.querySelector("#surveyResult");
    res.hidden = false;
    res.innerHTML = `
        Your total score is ${total}. Your subscale scores are:
        <ul>
            <li>Difficulty Identifying Feelings (DIF): ${dif}</li>
            <li>Difficulty Describing Feelings (DDF): ${ddf}</li> 
            <li>Externally-Oriented Thinking (EOT): ${eot}</li>
        </ul>

        Although Alexithymia is on a spectrum, researchers use arbitrary thresholds for convenience:
        <ul>
            <li>< 51: Non-Alexithymia</li>
            <li>52-60: Possible Alexithymia</li>
            <li>61+: Alexithymia</li>
        </ul>
        TAS-20 sourced from: ${src('https://embrace-autism.com/toronto-alexithymia-scale/')}

        <p>
        I am <b>not an expert</b>. I just skimmed some papers.
        Unfortunately, there isn't a lot of information for laypeople - perhaps because this is still a fairly new concept. 
        Any input is appreciated, preferrably as <a href="https://github.com/hahohihu/tas-20/issues">issues on Github</a>.
        </p>

        <p>
        The TAS-20 is the standard tool for measuring Alexithymia - a personality trait literally translated as a "lack of words for emotions".
        Someone with Alexithymia might feel their heart racing and start breathing short and fast, but not know why. 
        Or even if they recognized it as - let's say fear, they may not know what they're afraid of.
        </p>

        <p>
        There is some controversy over how best to define Alexithymia, resulting in a number of tools to measure it. The TAS-20 just measures three cognitive dimensions:
        <ol>
            <li>Difficulty identifying and differentiating feelings (DIF)</li>
            <li>Difficulty describing feelings (DDF)</li>
            <li>An externally oriented style of thinking (EOT), or a reduced tendency to reflect on feelings</li>
        </ol>
        DIF and DDF correlate strongly, but EOT is somewhat separate.
        </p>

        <p>
        The BVAQ also measures two affective dimensions:
        <ol>
            <li>A reduced ability to fantasize, or imagine</li>
            <li>Difficulty emotionalising - which is the ease or difficulty with which emotions are induced</li>
        </ol>

        The affective and cognitive dimensions don't correlate, and use different parts of the brain.
        ${src('https://www.tandfonline.com/doi/full/10.1080/02699930601056989')} ${src('https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6124373/')}
        </p>

        <p>
        The LEAS has yet another notion of it based on emotional awareness, based on levels of awareness from:
        <ol>
            <li>Physical sensations</li>
            <li>Action tendencies</li>
            <li>Single emotions</li>
            <li>Blends of emotions</li>
            <li>Blends of blends of emotions</li>
        </ol>
        And Alexithymia is then a failure in connecting the unconscious layers (1 & 2) with the conscious layers (3-5).

        The TAS-20 and the LEAS don't correlate well, in part because the LEAS uses observers to assess subjects, in comparison to the TAS-20, which is self-reported.
        ${src('https://pubmed.ncbi.nlm.nih.gov/15911914/')} ${src('https://www.frontiersin.org/articles/10.3389/fpsyg.2018.00453/full')}
        </p>

        <p>
        And to conclude: internet surveys aren't reliable. I don't even know if this is the real TAS-20.
        Self-report is also suspect - if you were extremely unaware, you could take the TAS-20 and come out "Non-Alexithymic". 
        There are some contradictory findings around the TAS-20, probably because of that.
        If you can, seeing a therapist or professional is always recommended.
        </p>
        `;
    $('html,body').scrollTop(0);
});
$("#surveyContainer").Survey({
    model: survey
});
