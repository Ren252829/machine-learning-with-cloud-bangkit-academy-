const predictClassification = require('../services/inferenceService');
const crypto = require('crypto');
const storeData = require('../services/storeData');

async function postPredictHandler(request, h) {
    const { image } = request.payload;
    const { model } = request.server.app;

    try {
        // Perform prediction
        const { confidenceScore, label,  suggestion } = await predictClassification(model, image);

        // Generate ID and timestamp
        const id = crypto.randomUUID();
        const createdAt = new Date().toISOString();

        // Build the response data
        const responseData = {
            id,
            result: label,
            suggestion: label === 'Cancer' ? 'Segera periksa ke dokter!' : 'Penyakit kanker tidak terdeteksi.',
            createdAt,
        };

        // Validate Firestore data
        const firestoreData = {
            ...responseData,
        };

        // Store data in Firestore
        await storeData(id, firestoreData);

        // Return success response
        const response = h.response({
            status: 'success',
            message: 'Model is predicted successfully',
            data: responseData,
        });
        response.code(201);
        return response;
    } catch (error) {
        console.error('Error storing data:', error);

        // Return error response
        return h.response({
            status: 'fail',
            message: 'Failed to store prediction data.',
        }).code(500);
    }
}

module.exports = postPredictHandler;
