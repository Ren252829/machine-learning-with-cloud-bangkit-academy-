const tf = require('@tensorflow/tfjs-node');
const InputError = require('../exceptions/InputError');

async function predictClassification(model, image) {
    try {
        // Decode image and preprocess to match model input requirements
        const tensor = tf.node
            .decodeJpeg(image)
            .resizeNearestNeighbor([224, 224])
            .expandDims()
            .toFloat();

        // Validate input shape
        if (tensor.shape[1] !== 224 || tensor.shape[2] !== 224 || tensor.shape[3] !== 3) {
            tensor.dispose(); // Release tensor memory if validation fails
            throw new InputError('Input image must have a width of 224, height of 224, and 3 color channels (RGB).');
        }

        const classes = ['Cancer', 'Non-cancer'];

        // Perform prediction
        const prediction = model.predict(tensor);
        const score = await prediction.data();
        const confidenceScore = Math.max(...score) * 100;

        // Determine the predicted class
        const classResult = tf.argMax(prediction, 1).dataSync()[0];
        const label = classes[classResult];

        // Set suggestion based on prediction
        let suggestion;
        if (label === 'Cancer') {
            suggestion = 'Segera periksa ke dokter!';
        } else if (label === 'Non-cancer') {
            suggestion = 'Penyakit kanker tidak terdeteksi.';
        }

        // Clean up tensor resources
        tensor.dispose();
        prediction.dispose();

        // Return prediction result
        return { confidenceScore, label, suggestion };
    } catch (error) {
        throw new InputError(`Terjadi kesalahan input: ${error.message}`);
    }
}

module.exports = predictClassification;
