

const exp = (function() {


    let p = {};

    let settings = {
        nSpins: 10,
        effort: ['highEffort', 'lowEffort'][Math.floor(Math.random() * 2)],
        mi: ['highMI', 'lowMI'][Math.floor(Math.random() * 2)],
    };

    let text = {};

    if (settings.effort == 'highEffort') {
        text.nextOrPrevious = "previous";
        text.nextLetters = "G, F, E, D, C"
        text.speed2 = "If you do not tap your right arrow as fast as possible,<br>the wheel will not build enough momentum to spin.";
    } else if (settings.effort == 'lowEffort') {
        text.nextOrPrevious = "next";
        text.nextLetters = "I, J, K, L, M"
        text.speed2 = "If you tap your right arrow either too quickly or too slowly,<br>the wheel will not build enough momentum to spin.";
    };

    jsPsych.data.addProperties({
        spins_per_wheel: settings.nSpins,
        effort_order: settings.effort,
        mi_order: settings.mi,
    });

    // define each wedge
    const wedges = {
        one: {color:"#fe0000", label:"1"},
        two: {color:"#800001", label:"2"},
        three: {color:"#fe6a00", label:"3"},
        four: {color:"#803400", label:"4"},
        five: {color:"#0094fe", label:"5"},
        six: {color:"#806b00", label:"6"},
        seven: {color:"#00fe21", label:"7"},
        eight: {color:"#007f0e", label:"8"},
        nine: {color:"#ffd800", label:"9"},
        ten: {color:"#00497e", label:"10"},
        eleven: {color:"#0026ff", label:"11"},
        twelve: {color:"#001280", label:"12"},
        thirteen: {color:"#b100fe", label:"13"},
    };

   /*
    *
    *   INSTRUCTIONS
    *
    */

    const html = {

        intro_holeInOne: [`<div class='parent' style='text-align: left'></p>For the next 10 to 15 minutes, you'll be helping us answer the following question:<br>
            "What makes some games more immersive and engaging than others?"</p>

            <p>Specifically, you'll play two games and provide feedback about each one. 
            By playing games and providing feedback, you'll help us understand how to design games 
            that are as immersive and engaging as possible.</p></div>`,

            `<div class='parent'>The first game that you'll play is called Hole in One.</p>
            <p>To learn about and play Hole in One, continue to the next screen.</p></div>`],

        intro_spinTheWheel: [`<div class='parent'><p>Thank you for playing and evaluating Hole in One!</p>
            <p>The second and final game that you'll play is called Spin the Wheel.<br>
            To learn about and play Spin the Wheel, continue to the next screen.</p></div>`,

            `<div class='parent'>
                <p>In Spin the Wheel, you'll spin a series of prize wheels.</p>
                <p>Each time you spin a prize wheel, you'll earn points.
                <br>The number of points you earn depends on where the wheel lands.</p>
                <p>Your goal is to earn as many points as possible!</p>
            </div>`,

            `<div class='parent'>
                <p>To spin a prize wheel, you must build momentum by pressing the correct keys on your keyboard.</p>
                <p>In the center of the wheel, you'll see a letter. To build momentum, you must press the keys on your keyboard that correspond to the ${text.nextOrPrevious} 5 letters in the alphabet.</p>
                <p>For instance, if you see the letter H, you'll need to press ${text.nextLetters} (in that order).</p></div>`,

            `<div class='parent'>
                <p>Each time you press the correct key, the wheel will build momentum.<br>
                Once the wheel builds enough momentum, a "Ready!" message will appear.</p>
                <p>Once the "Ready!" message appears, you must press your space bar to spin the wheel.</p>
                <p>To practice spinning, continue to the next page</p>
            </div>`],

        postPractice: [
            `<div class='parent'>
                <p>Practice is now complete! Soon, you'll play Spin the Wheel.</p>
                <p>Remember: Your goal is to earn as many points as possible.</p>
                <p>The amount of points you earn for each spin is equal to the number you land on. 
                For example, if you land on a 3, you'll get 3 points.</p>
                <p>You'll find out how many points you earned in total at the end of the game.</p>
            </div>`
        ],

        postAttnChk: [
            `<div class='parent'>
                <p>You're now ready to play Spin the Wheel!</p>
                <p>When you continue, Spin the Wheel will begin.</p>
            </div>`
        ],
    };

    function MakeAttnChk (settings) {

        const postPractice = {
            type: jsPsychInstructions,
            pages: html.postPractice,
            show_clickable_nav: true,
            post_trial_gap: 500,
            allow_keys: false,
        };

        let correctAnswers = [`Earn as many points as possible.`, `5`];

        const errorMessage = {
            type: jsPsychInstructions,
            pages: [`<div class='parent'><p>You provided the wrong answer.<br>To make sure you understand the game, please continue to re-read the instructions.</p></div>`],
            show_clickable_nav: true,
            allow_keys: false,
        };

        const attnChk = {
            type: jsPsychSurveyMultiChoice,
            preamble: `<div class='parent'>
                <p>Please answer the following questions.</p>
                </div>`,
            questions: [
                {
                    prompt: "What is the goal of Spin the Wheel?", 
                    name: `attnChk1`, 
                    options: [`Earn as many points as possible.`, `Spin the wheel as fast as possible.`],
                },
                {
                    prompt: "How many points is it worth when the wheel lands on a 5?", 
                    name: `attnChk2`, 
                    options: [`0`, `5`, `10`],
                },
            ],
            scale_width: 500,
            on_finish: (data) => {
                  const totalErrors = dmPsych.getTotalErrors(data, correctAnswers);
                  data.totalErrors = totalErrors;
            },
        };

        const conditionalNode = {
          timeline: [errorMessage],
          conditional_function: () => {
            const fail = jsPsych.data.get().last(1).select('totalErrors').sum() > 0 ? true : false;
            return fail;
          },
        };

        const instLoop = {
          timeline: [postPractice, attnChk, conditionalNode],
          loop_function: () => {
            const fail = jsPsych.data.get().last(2).select('totalErrors').sum() > 0 ? true : false;
            return fail;
          },
        };

        this.timeline = [instLoop];
    }
   

    const practiceWheel_1 = {
        type: jsPsychCanvasButtonResponse,
        prompt: `<div class='parent' style='font-size:16px'>
            <p>To build momentum, press the keys on your keyboard that correspond to ${text.nextOrPrevious} 5 letters of the alphabet.</br>
            For instance, if you see the letter H, you'll need to press ${text.nextLetters} (in that order).</p>
            <p>Once you build enough momentum, a "Ready!" message will appear.<br>Then, you must press your space bar to spin the wheel.</p>
            </div>`,
        stimulus: function(c, spinnerData) {
            dmPsych.spinner(c, spinnerData, [wedges.three, wedges.three, wedges.five, wedges.five], jsPsych.timelineVariable('effort'), [0], 1);
        },
        nSpins: 1,
        canvas_size: [500, 500],
        post_trial_gap: 500,
    };

    const practiceWheel_2 = {
        type: jsPsychCanvasButtonResponse,
        prompt: `<div class='parent' style='font-size:16px'>
            <p>To build momentum, press the keys on your keyboard that correspond to ${text.nextOrPrevious} 5 letters of the alphabet.</br>
            For instance, if you see the letter H, you'll need to press ${text.nextLetters} (in that order).</p>
            <p>Once you build enough momentum, a "Ready!" message will appear.<br>Then, you must press your space bar to spin the wheel.</p>
            </div>`,
        stimulus: function(c, spinnerData) {
            dmPsych.spinner(c, spinnerData, [wedges.three, wedges.three, wedges.five, wedges.five], jsPsych.timelineVariable('effort'), [0, 0, 0], 3);
        },
        nSpins: 2,
        canvas_size: [500, 500],
    };

    p.consent = {
        type: jsPsychExternalHtml,
        url: "./html/consent.html",
        cont_btn: "advance",
    };

    p.wheel_practice = {
        timeline: [practiceWheel_1, practiceWheel_2],
        timeline_variables: makeTimelineVariables(settings),
    };

    p.intro_holeInOne = {
        type: jsPsychInstructions,
        pages: html.intro_holeInOne,
        show_clickable_nav: true,
        post_trial_gap: 500,
        allow_keys: false,
    };

    p.intro_spinTheWheel = {
        type: jsPsychInstructions,
        pages: html.intro_spinTheWheel,
        show_clickable_nav: true,
        post_trial_gap: 500,
        allow_keys: false,
    };

    p.postAttnChk = {
        type: jsPsychInstructions,
        pages: html.postAttnChk,
        show_clickable_nav: true,
        post_trial_gap: 500,
        allow_keys: false,
    };


    p.attnChk = new MakeAttnChk(settings);

    
   /*
    *
    *   TASK
    *
    */

    function makeTimelineVariables(settings, game) {

        // array indiciating whether or not the outcome of each spin is guaranteed
        let guaranteedOutcome = new Array(settings.nSpins).fill(0);

        // set sectors, ev, sd, and mi
        let sectors, ev, sd, mi;
        if (settings.mi == 'highMI') {
            sectors = [ wedges.two, wedges.four, wedges.seven, wedges.ten ];
            ev = 5.75;
            sd = 3.5;
            mi = 2;
        } else if (settings.mi == 'lowMI') {
            sectors = [ wedges.four, wedges.four, wedges.four, wedges.eleven ];
            ev = 5.75;
            sd = 3.5;
            mi = .81;
        };

        // set length of target sequence
        let timelineVariables = [{game, game, sectors: sectors, mi: mi, ev: ev, sd: sd, effort: settings.effort, guaranteedOutcome: guaranteedOutcome}];

        return timelineVariables;
    };

    const wheel = {
        type: jsPsychCanvasButtonResponse,
        stimulus: function(c, spinnerData) {
            dmPsych.spinner(c, spinnerData, jsPsych.timelineVariable('sectors'), jsPsych.timelineVariable('effort'), jsPsych.timelineVariable('guaranteedOutcome'), settings.nSpins);
        },
        nSpins: settings.nSpins,
        canvas_size: [500, 500],
        post_trial_gap: 1000,
        data: {game: jsPsych.timelineVariable('game'), mi: jsPsych.timelineVariable('mi'), sectors: jsPsych.timelineVariable('sectors'), ev: jsPsych.timelineVariable('ev'), sd: jsPsych.timelineVariable('sd')},
    };

    const holeInOne = {
        type: dmPsychHoleInOne,
        stimulus: dmPsych.holeInOne.run,
        total_shots: 12,  
        canvas_size: [475, 900],
        ball_color: 'white',
        ball_size: 10,
        ball_xPos: .13,
        ball_yPos: .5,
        wall_width: 75,
        wall_color: '#797D7F',
        wall_xPos: .9,
        hole_size: 75,
        friction: .02,
        tension: .01,
        prompt: `<div class='instructions'>

        <p><strong>Hole in One</strong>. The goal of Hole in One is to shoot the ball through the hole.<br>
        Follow the instructions in the game area, then play Hole in One. 
        We'll let you know when time is up.</p></div>`,
        data: {game: 'holeInOne'}
    };


   /*
    *
    *   QUESTIONS
    *
    */

    // scales
    var zeroToExtremely = ['0<br>A little', '1', '2', '3', '4', '5', '6', '7', '8<br>Extremely'];
    var zeroToALot = ['0<br>A little', '1', '2', '3', '4', '5', '6', '7', '8<br>A lot'];

    // constructor functions
    function MakeFlowQs(game) {
        this.type = jsPsychSurveyLikert;
        this.preamble = `<div style='padding-top: 50px; width: 850px; font-size:16px'>

        <p>Thank you for completing ${game}!</p>

        <p>During ${game}, to what extent did you feel immersed and engaged in what you were doing?<br>
        Report the degree to which you felt immersed and engaged by answering the following questions.</p></div>`;
        this.questions = [
            {
                prompt: `During ${game}, to what extent did you feel <strong>absorbed</strong> in what you were doing?`,
                name: `absorbed`,
                labels: zeroToExtremely,
                required: true,
            },
            {
                prompt: `During ${game}, to what extent did you feel <strong>immersed</strong> in what you were doing?`,
                name: `immersed`,
                labels: zeroToExtremely,
                required: true,
            },
            {
                prompt: `During ${game}, to what extent did you feel <strong>engaged</strong> in what you were doing?`,
                name: `engaged`,
                labels: zeroToExtremely,
                required: true,
            },
            {
                prompt: `During ${game}, to what extent did you feel <strong>engrossed</strong> in what you were doing?`,
                name: `engrossed`,
                labels: zeroToExtremely,
                required: true,
            },
        ];
        this.randomize_question_order = false;
        this.scale_width = 500;
        this.data = {game: game, mi: jsPsych.timelineVariable('mi'), sectors: jsPsych.timelineVariable('sectors'), ev: jsPsych.timelineVariable('ev'), sd: jsPsych.timelineVariable('sd')};
        this.on_finish =(data) => {
            dmPsych.saveSurveyData(data);
        };
    };

    function MakeEnjoyQs(game) {
        this.type = jsPsychSurveyLikert;
        this.preamble = `<div style='padding-top: 50px; width: 850px; font-size:16px'>

        <p>Below are a few more questions about ${game}.</p>

        <p>Instead of asking about immersion and engagement, these questions ask about <strong>enjoyment</strong>.<br>
        Report how much you <strong>enjoyed</strong> ${game} by answering the following questions.</p></div>`;
        this.questions = [
            {
                prompt: `How much did you <strong>enjoy</strong> playing ${game}?`,
                name: `enjoyable`,
                labels: zeroToALot,
                required: true,
            },
            {
                prompt: `How much did you <strong>like</strong> playing ${game}?`,
                name: `like`,
                labels: zeroToALot,
                required: true,
            },
            {
                prompt: `How much did you <strong>dislike</strong> playing ${game}?`,
                name: `dislike`,
                labels: zeroToALot,
                required: true,
            },
            {
                prompt: `How much <strong>fun</strong> did you have playing ${game}?`,
                name: `fun`,
                labels: zeroToALot,
                required: true,
            },
            {
                prompt: `How <strong>entertaining</strong> was ${game}?`,
                name: `entertaining`,
                labels: zeroToExtremely,
                required: true,
            },
        ];
        this.randomize_question_order = false;
        this.scale_width = 500;
        this.data = {game: game, mi: jsPsych.timelineVariable('mi'), sectors: jsPsych.timelineVariable('sectors'), ev: jsPsych.timelineVariable('ev'), sd: jsPsych.timelineVariable('sd')};
        this.on_finish = (data) => {
            dmPsych.saveSurveyData(data);
        };
    };

    function MakeEffortQs(game) {
        this.type = jsPsychSurveyLikert;
        this.questions = [
            {
                prompt: `While playing ${game},<br>how much effort did it feel like you were exerting?`,
                name: `effort`,
                labels: zeroToALot,
                required: true,
            },
        ];
        this.randomize_question_order = false;
        this.scale_width = 500;
        this.data = {game: game, mi: jsPsych.timelineVariable('mi'), sectors: jsPsych.timelineVariable('sectors'), ev: jsPsych.timelineVariable('ev'), sd: jsPsych.timelineVariable('sd')};
        this.on_finish = (data) => {
            dmPsych.saveSurveyData(data);      
        };
    };

    // timeline: first wheel
    p.spinTheWheel = {
        timeline: [wheel, new MakeFlowQs("Spin the Wheel"), new MakeEnjoyQs("Spin the Wheel"), new MakeEffortQs("Spin the Wheel")],
        timeline_variables: makeTimelineVariables(settings, "Spin the Wheel"),
    };

    p.holeInOne = {
        timeline: [holeInOne, new MakeFlowQs("Hole in One"), new MakeEnjoyQs("Hole in One"), new MakeEffortQs("Hole in One")],
    };

   /*
    *
    *   Demographics
    *
    */

    p.demographics = (function() {


        const taskComplete = {
            type: jsPsychInstructions,
            pages: function () { 
                let scoreArray = jsPsych.data.get().select('score').values;
                let totalScore = scoreArray[scoreArray.length - 1];
                return [`<div class='parent'>
                    <p>Spin the Wheel is now complete! You won a total of <strong>${totalScore}</strong> points!</p>
                    <p>To finish this study, please continue to answer a few final questions.</p>
                    </div>`];
            },  
            show_clickable_nav: true,
            post_trial_gap: 500,
            allow_keys: false,
        };

        const meanOfEffScale = ['-2<br>Strongly<br>Disagree', '-1<br>Disagree', '0<br>Neither agree<br>nor disagree', '1<br>Agree', '2<br>Strongly<br>Agree'];

        const meanOfEff = {
            type: jsPsychSurveyLikert,
            preamble:
                `<div style='padding-top: 50px; width: 900px; font-size:16px'>
                    <p>Please answer the following questions as honestly and accurately as possible.</p>
                </div>`,
            questions: [
                {
                    prompt: `Pushing myself helps me see the bigger picture.`,
                    name: `meanOfEff_1`,
                    labels: meanOfEffScale,
                    required: true,
                },
                {
                    prompt: `I often don't understand why I am working so hard.`,
                    name: `meanOfEff_2r`,
                    labels: meanOfEffScale,
                    required: true,
                },
                {
                    prompt: `I learn the most about myself when I am trying my hardest.`,
                    name: `meanOfEff_3`,
                    labels: meanOfEffScale,
                    required: true,
                },
                {
                    prompt: `Things make more sense when I can put my all into them.`,
                    name: `meanOfEff_4`,
                    labels: meanOfEffScale,
                    required: true,
                },
                {
                    prompt: `When I work hard, it rarely makes a difference.`,
                    name: `meanOfEff_5r`,
                    labels: meanOfEffScale,
                    required: true,
                },
                {
                    prompt: `When I push myself, what I'm doing feels important.`,
                    name: `meanOfEff_6`,
                    labels: meanOfEffScale,
                    required: true,
                },
                {
                    prompt: `When I push myself, I feel like I'm part of something bigger than me.`,
                    name: `meanOfEff_7`,
                    labels: meanOfEffScale,
                    required: true,
                },
                {
                    prompt: `Doing my best gives me a clear purpose in life.`,
                    name: `meanOfEff_8`,
                    labels: meanOfEffScale,
                    required: true,
                },
                {
                    prompt: `When I try my hardest, my life has meaning.`,
                    name: `meanOfEff_9`,
                    labels: meanOfEffScale,
                    required: true,
                },
                {
                    prompt: `When I exert myself, I feel connected to my ideal life.`,
                    name: `meanOfEff_10`,
                    labels: meanOfEffScale,
                    required: true,
                },
            ],
            randomize_question_order: false,
            scale_width: 500,
            on_finish: (data) => {
                dmPsych.saveSurveyData(data); 
            },
        };

        const gender = {
            type: jsPsychHtmlButtonResponse,
            stimulus: '<p>What is your gender?</p>',
            choices: ['Male', 'Female', 'Other'],
            on_finish: (data) => {
                data.gender = data.response;
            }
        };

        const age = {
            type: jsPsychSurveyText,
            questions: [
                {
                    prompt: "Age:", 
                    name: "age",
                    required: true,
                }
            ],
            on_finish: (data) => {
                dmPsych.saveSurveyData(data); 
            },
        }; 

        const ethnicity = {
            type: jsPsychSurveyHtmlForm,
            preamble: '<p>What is your race / ethnicity?</p>',
            html: `<div style="text-align: left">
            <p>White / Caucasian <input name="ethnicity" type="radio" value="white"/></p>
            <p>Black / African American <input name="ethnicity" type="radio" value="black"/></p>
            <p>East Asian (e.g., Chinese, Korean, Vietnamese, etc.) <input name="ethnicity" type="radio" value="east-asian"/></p>
            <p>South Asian (e.g., Indian, Pakistani, Sri Lankan, etc.) <input name="ethnicity" type="radio" value="south-asian"/></p>
            <p>Latino / Hispanic <input name="ethnicity" type="radio" value="hispanic"/></p>
            <p>Middle Eastern / North African <input name="ethnicity" type="radio" value="middle-eastern"/></p>
            <p>Indigenous / First Nations <input name="ethnicity" type="radio" value="indigenous"/></p>
            <p>Bi-racial <input name="ethnicity" type="radio" value="indigenous"/></p>
            <p>Other <input name="other" type="text"/></p>
            </div>`,
            on_finish: (data) => {
                data.ethnicity = data.response.ethnicity;
                data.other = data.response.other;
            }
        };

        const english = {
            type: jsPsychHtmlButtonResponse,
            stimulus: '<p>Is English your native language?:</p>',
            choices: ['Yes', 'No'],
            on_finish: (data) => {
                data.english = data.response;
            }
        };  

        const finalWord = {
            type: jsPsychSurveyText,
            questions: [{prompt: "Questions? Comments? Complains? Provide your feedback here!", rows: 10, columns: 100, name: "finalWord"}],
            on_finish: (data) => {
                dmPsych.saveSurveyData(data); 
            },
        }; 


        const demos = {
            timeline: [taskComplete, meanOfEff, gender, age, ethnicity, english, finalWord]
        };

        return demos;

    }());


   /*
    *
    *   SAVE DATA
    *
    */

    p.save_data = {
        type: jsPsychPipe,
        action: "save",
        experiment_id: "lEWIqPCNEg4q",
        filename: dmPsych.filename,
        data_string: ()=>jsPsych.data.get().csv()
    };

    return p;

}());

const timeline = [
    exp.consent, 
    exp.intro_holeInOne, exp.holeInOne, 
    exp.intro_spinTheWheel, exp.wheel_practice, exp.attnChk, exp.postAttnChk, exp.spinTheWheel, 
    exp.demographics, exp.save_data];

jsPsych.run(timeline);
