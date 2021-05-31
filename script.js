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
    return `<a href="${htmlEntities(str)}">(source)</a>`;
}

function formatNum(n) {
    // * 1 removes trailing 0s
    return n.toFixed(1) * 1;
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
        Your total score is ${formatNum(total)}/100. Your subscale scores are:
        <ul>
            <li>Difficulty Identifying Feelings (DIF): ${formatNum(dif)}</li>
            <li>Difficulty Describing Feelings (DDF): ${formatNum(ddf)}</li> 
            <li>Externally-Oriented Thinking (EOT): ${formatNum(eot)}</li>
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
        I've also tried to make this accessible, but have an able worldview - any feedback there is also appreciated.
        </p>

        <p>
        The TAS-20 is the standard tool for measuring Alexithymia - a personality trait literally translated as a "lack of words for emotions".
        Someone with Alexithymia might feel their heart racing and start breathing short and fast, but not know why. 
        Or even if they recognized it as - let's say fear, they may not know what they're afraid of.
        </p>

        <p>
        There are differences in the operational definition of Alexithymia, resulting in a number of tools to measure it. The TAS-20 just measures three cognitive dimensions:
        <ol>
            <li>Difficulty identifying and differentiating feelings (DIF)</li>
            <li>Difficulty describing feelings (DDF)</li>
            <li>An externally oriented style of thinking (EOT), or a reduced tendency to reflect on feelings</li>
        </ol>
        Within the TAS-20 model, there are three hypothesized types of Alexithymia:
        <ol>
            <li>General-high Alexithymia (GHA): high scores in all 3 subscales</li>
            <li>Introvert-high Alexithymia (IHA): high scores in DIF and DDF, but low scores in EOT</li>
            <li>Extrovert-high Alexithymia (EHA): high scores in EOT, low scores in DIF and DDF</li>
        </ol>
        Note: the stability of these has not been established ${src('https://bmcpsychiatry.biomedcentral.com/articles/10.1186/1471-244X-11-33')}.
        </p>

        <p>
        The BVAQ also measures two affective dimensions:
        <ol>
            <li>A reduced ability to fantasize, or imagine</li>
            <li>Difficulty emotionalising - i.e. how easily emotionally inducing events arouse emotions</li>
        </ol>
        The affective and cognitive dimensions don't correlate, and use different parts of the brain
        ${src('https://www.tandfonline.com/doi/full/10.1080/02699930601056989')} ${src('https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6124373/')}.
        </p>

        <p>
        The LEAS was not designed with Alexithymia in mind, but is relevant because it takes a developmental model of emotional awareness:
        <table id="leasTable">
            <caption>Characteristics of Five Levels of Emotional Awareness</caption>
            <tr>
                <th scope="col">Level of Emotional Awareness</th>
                <th scope="col">Subjective Quality of Emotional Experience</th>
                <th scope="col">Differentiation of Emotion</th>
            </tr>

            <tr>
                <th scope="row">1. Sensorimotor reflexive</th>
                <td>Bodily Sensation</td>
                <td>Global undifferentiation of arousal</td>
            </tr>

            <tr>
                <th scope="row">2. Sensorimotor enactive</th>
                <td>Action tendency (e.g. urges) and/or global arousal</td>
                <td>Action tendency or global hedonic state</td>
            </tr>

            <tr>
                <th scope="row">3. Preoperational</th>
                <td>Pervasive emotion (i.e. single emotion)</td>
                <td>Either/or experience of emotional extremes (limited repertoire)</td>
            </tr>

            <tr>
                <th scope="row">4. Concrete operational</th>
                <td>Differentiated, attenuated emotion</td>
                <td>Blends of emotions, concurrence of opposing emotions</td>
            </tr>

            <tr>
                <th scope="row">5. Formal operational</th>
                <td>Peak differentiation and blending</td>
                <td>Richer differentiations of quality and intensity</td>
            </tr>
        </table>
        <br/>
        And Alexithymia can then be conceived as being in a drastically lower developmental stage than is expected. 
        More information can be found here: ${src('https://pubmed.ncbi.nlm.nih.gov/3812780/')}.
        The TAS-20 and the LEAS don't correlate well
        ${src('https://pubmed.ncbi.nlm.nih.gov/15911914/')} ${src('https://www.frontiersin.org/articles/10.3389/fpsyg.2018.00453/full')}
        </p>

        <p>
        And closing with a warning: internet surveys aren't reliable.
        Self-report is also suspect - if you were extremely unaware, you could take the TAS-20 and have "Non-Alexithymia". 
        There are some contradictory findings around the TAS-20, probably because of that.
        If you can, seeing a therapist or professional is always recommended.
        </p>
        `;
    $('html,body').scrollTop(0);
});
$("#surveyContainer").Survey({
    model: survey
});
