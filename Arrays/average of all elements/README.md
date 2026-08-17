# Average of All Elements

## Problem Statement

Given an array of integers, find the average of all the elements in the array.

## Example

**Input:**

```text
10 20 30 40
```

**Output:**

```text
25.0
```

## Approach

1. Initialize `sum = 0`.
2. Traverse through every element of the array.
3. Add each element to `sum`.
4. Divide the total sum by the number of elements.
5. Return the average.

## Java Solution

```java
class Solution {
    public static double average(int[] arr) {
        int sum = 0;

        for (int i = 0; i < arr.length; i++) {
            sum += arr[i];
        }

        return (double) sum / arr.length;
    }
}
```

## Complexity

* **Time Complexity:** `O(n)`
* **Space Complexity:** `O(1)`

## Key Concept

```text
Average = Sum of all elements / Number of elements
```

## Language

* Java
