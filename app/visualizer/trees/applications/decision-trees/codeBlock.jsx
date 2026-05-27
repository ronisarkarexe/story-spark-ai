"use client";
import SharedCodeBlock from "@/app/components/ui/SharedCodeBlock";

export default function DecisionTreesCodeBlock() {
  const codeExamples = {
    python: `from sklearn.tree import DecisionTreeClassifier
from sklearn import datasets
from sklearn.model_selection import train_test_split

# Load Iris dataset
iris = datasets.load_iris()
X = iris.data
y = iris.target

# Split dataset into training set and test set
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=1)

# Create Decision Tree classifer object
clf = DecisionTreeClassifier(criterion="entropy", max_depth=3)

# Train Decision Tree Classifer
clf = clf.fit(X_train,y_train)

# Predict the response for test dataset
y_pred = clf.predict(X_test)`,
    javascript: `// A simple manual Decision Tree implementation in JS
class DecisionNode {
  constructor(feature, threshold, left, right, value) {
    this.feature = feature;
    this.threshold = threshold;
    this.left = left;
    this.right = right;
    this.value = value;
  }
}

function predict(node, row) {
  if (node.value !== undefined) {
    return node.value;
  }
  if (row[node.feature] < node.threshold) {
    return predict(node.left, row);
  } else {
    return predict(node.right, row);
  }
}

// Example tree: If feature 0 < 5.0, class is 0, else 1
const root = new DecisionNode(0, 5.0, 
  new DecisionNode(null, null, null, null, 0),
  new DecisionNode(null, null, null, null, 1)
);

const sample = [4.5, 3.2, 1.3, 0.2];
const prediction = predict(root, sample);
console.log("Predicted class:", prediction);`
  };

  return <SharedCodeBlock title="Decision Tree Example" codeExamples={codeExamples} color="text-purple-500" />;
}
