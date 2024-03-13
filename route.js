const express = require("express");
const router  = express.Router({mergeParams: true});
const axios = require('axios');

router.get('/:formId/filteredResponses', async (req, res) => {
    const formId = req.params.formId;
    const apiKey = process.env.API_KEY;

    const filters = req.query;

    // grab conditions from body
    const conditions = req?.body && req?.body?.length > 0 ? req.body : [];

    try {
        const { responses, totalResponses, pageCount } = await fetchResponses(formId, apiKey, filters);

        // for testing
        // console.log({
        //     conditions,
        //     filters,
        //     totalResponses,
        //     pageCount,
        //     responses: responses.length,
        //     responsesKeys: Object.keys(responses[0])
        // })

        const filteredResponses = responses.filter((form) => {            
            const questions = form.questions;
            for (const condition of conditions) {
                const match = questions.find((q) => q.id === condition.id)
                // if no question match, ignore 
                if (!match) continue;
                const check = compareValues(condition.value, match.value, condition.condition);
                // if check fails, ignore form 
                if (!check) return false;
            };
            // if no conditions failed, return true
            return true;
        });

        res.status(200).json({
            responses: filteredResponses,
        });
    } catch (error) {
        console.error({
            code: error.code,
            message: error.message
        });
        res.status(500).json({ error: 'Internal server error.' });
    }
});

// function to fetch filtered responses from Fillout.com API
async function fetchResponses(formId, apiKey, filters) {
    const getForm = `https://api.fillout.com/v1/api/forms/${formId}`;
    const getSubmissions = `https://api.fillout.com/v1/api/forms/${formId}/submissions`;

    const response = await axios.get(getSubmissions, {
        headers: { 'Authorization': `Bearer ${apiKey}` },
        filters
    });
    return response.data;
};

function compareValues(inputVal, formVal, comparisonType) {
    if (comparisonType === 'equals') return inputVal === formVal;
    if (comparisonType === 'does_not_equal') return inputVal !== formVal;
    if (comparisonType === 'greater_than') return formVal > inputVal;
    return formVal < inputVal;
};

module.exports = router;
