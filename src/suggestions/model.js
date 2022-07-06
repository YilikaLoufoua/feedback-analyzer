import * as tf from "@tensorflow/tfjs";

const trainTasks = require("./data/trainingData.json");
console.log("trainTasks: ", trainTasks);

const MODEL_NAME = "suggestion-model";
const N_CLASSES = 3;

const encodeData = async (encoder, tasks) => {
    const sentences = tasks.map((t) => t.text.toLowerCase());
    const embeddings = await encoder.embed(sentences);
    return embeddings;
};

const trainModel = async (encoder) => {
    console.log("encoder: ", encoder);
    console.log("trainModel: ");
    // try {
    //     const loadedModel = await tf.loadLayersModel(`localstorage://${MODEL_NAME}`);
    //     console.log("Using existing model");
    //     return loadedModel;
    // } catch (e) {
    //     console.log("Training new model");
    // }

    const xTrain = await encodeData(encoder, trainTasks);
    console.log("xTrain: ", xTrain);

    const yTrain = tf.tensor2d(
        trainTasks.map((t) => [
            t.icon === "peerRelations" ? 1 : 0,
            t.icon === "material" ? 1 : 0,
            t.icon === "support" ? 1 : 0,
        ])
    );
    console.log("yTrain: ", yTrain);
    const model = tf.sequential();

    model.add(
        tf.layers.dense({
            inputShape: [xTrain.shape[1]],
            activation: "softmax",
            units: N_CLASSES,
        })
    );

    model.compile({
        loss: "categoricalCrossentropy",
        optimizer: tf.train.adam(0.001),
        metrics: ["accuracy"],
    });

    console.log("Training started.");
    await model.fit(xTrain, yTrain, {
        batchSize: 32,
        validationSplit: 0.1,
        shuffle: true,
        epochs: 600,
    });
    console.log("Training complete.");

    await model.save(`localstorage://${MODEL_NAME}`);

    return model;
};

const suggestIcon = async (model, encoder, taskName, threshold) => {
    if (!taskName.trim().includes(" ")) {
        return null;
    }
    const xPredict = await encodeData(encoder, [{ text: taskName }]);

    const prediction = await model.predict(xPredict).data();
    console.log("prediction: ", prediction);

    if (prediction[0] > threshold) {
        return "peerRelations";
    } else if (prediction[1] > threshold) {
        return "material";
    } else if (prediction[2] > threshold) {
        return "support";
    } else {
        return "low confidence";
    }
};

export { suggestIcon, trainModel };

