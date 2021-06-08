const express = require('express');
const dotenv = require('dotenv');
dotenv.config();

function getNLUInstance(){
    let api_key = process.env.API_KEY;
    let api_url = process.env.API_URL;

    // From IBM documentation: https://cloud.ibm.com/apidocs/natural-language-understanding?utm_medium=Exinfluencer\&utm_source=Exinfluencer\&utm_content=000026UJ\&utm_term=10006555\&utm_id=NA-SkillsNetwork-Channel-SkillsNetworkCoursesIBMDeveloperSkillsNetworkCD0220ENSkillsNetwork20363180-2021-01-01\&code=node#analyze
    const NaturalLanguageUnderstandingV1 = require('ibm-watson/natural-language-understanding/v1');
    const { IamAuthenticator } = require('ibm-watson/auth');

    const naturalLanguageUnderstanding = new NaturalLanguageUnderstandingV1({
        version: '2020-08-01',
        authenticator: new IamAuthenticator({
            apikey: api_key,
        }),
        serviceUrl: api_url,
    });
    
    return naturalLanguageUnderstanding;
}

const app = new express();

app.use(express.static('client'))

const cors_app = require('cors');
app.use(cors_app());

app.get("/",(req,res)=>{
    res.render('index.html');
});

app.get("/url/emotion", async (req,res) => {

    const lang = getNLUInstance();

    // Following the guidance from here: https://www.youtube.com/watch?v=53Bip8-F7xw
    const analyzeParams = {
        url: req.query.url,
        features: {
            emotion: {}
        }
    };

    const analysisResults = await lang.analyze(analyzeParams);

    // console.log("URL Emotion: ", JSON.stringify(analysisResults, null, 2));
    return res.send(analysisResults.result.emotion.document.emotion);
});

app.get("/url/sentiment", async (req,res) => {

    const lang = getNLUInstance();

    const analyzeParams = {
        url: req.query.url,
        features: {
            sentiment: {}
        }
    };

    const analysisResults = await lang.analyze(analyzeParams);

    // console.log("URL Sentiment: ", JSON.stringify(analysisResults, null, 2));
    return res.send(analysisResults.result.sentiment.document.label);

    // return res.send("url sentiment for "+req.query.url);
});

app.get("/text/emotion", async (req,res) => {

    const lang = getNLUInstance();

    const analyzeParams = {
        text: req.query.text,
        features: {
            emotion: {}
        }
    };

    const analysisResults = await lang.analyze(analyzeParams);

    console.log("Text Emotion: ", JSON.stringify(analysisResults, null, 2));
    return res.send(analysisResults.result.emotion.document.emotion);

    // return res.send({"happy":"10","sad":"90"});
});

app.get("/text/sentiment", async (req,res) => {

    const lang = getNLUInstance();

    const analyzeParams = {
        text: req.query.text,
        features: {
            sentiment: {}
        }
    };

    const analysisResults = await lang.analyze(analyzeParams);

    console.log("Text Sentiment: ", JSON.stringify(analysisResults, null, 2));
    return res.send(analysisResults.result.sentiment.document.label);

    // return res.send("text sentiment for "+req.query.text);
});

let server = app.listen(8080, () => {
    console.log('Listening', server.address().port)
})

