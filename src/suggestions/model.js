import * as tf from "@tensorflow/tfjs";

const trainTasks = require("./data/trainingData.json");
console.log("trainTasks: ", trainTasks);

const MODEL_NAME = "suggestion-model";
const N_CLASSES = 5;

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
            t.icon === "Material" ? 1 : 0,
            t.icon === "Lecture" ? 1 : 0,
            t.icon === "Peer Relations" ? 1 : 0,
            t.icon === "Support" ? 1 : 0,
            t.icon === "No Category" ? 1 : 0,
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
    const categories = ["Material", "Lecture", "Peer Relations", "Support", "No Category"];
    console.log("categories: ", categories);
    console.log("prediction: ", prediction);

    if (prediction[0] > threshold) {
        return categories[0];
    } else if (prediction[1] > threshold) {
        return categories[1];
    } else if (prediction[2] > threshold) {
        return categories[2];
    } else if (prediction[3] > threshold) {
        return categories[3];
    } else {
        return categories[4];
    }
};

export { suggestIcon, trainModel };

