const array = [];

const age1 = 25

// Step 2: Define objects to be added
const object1 = { id: 1, name: 'Alice', age: 25 };
const object2 = { id: 2, name: 'Bob', age: 30 };
const object3 = { id: 3, name: 'Charlie', age: 25 };
const object4 = { id: 4, name: 'David', age: 40 };

// Step 3: Push each object into the array
array.push(object1);
array.push(object2);
array.push(object3);
array.push(object4);

function filter(array, age1) {
    // Filter the array based on the given number
    let filteredNumber = array.filter(function(i) {
        return age1 === i.age;
    });
    // Return the filtered array
    return filteredNumber;
}

// Call the function and log the result
console.log(filter(array, age1));
