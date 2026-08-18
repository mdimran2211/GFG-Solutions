import java.util.*;

public class Solution {

    static int CountOccurences(int[] arr, int x) {

        int count = 0;

        for (int i = 0; i < arr.length; i++) {

            if (arr[i] == x) {
                count++;
            }
        }

        return count;
    }

    public static void main(String[] args) {

        Scanner sc = new Scanner(System.in);

        int n = sc.nextInt();

        int[] arr = {2, 5, 3, 6};

        int x = sc.nextInt();

        System.out.print(CountOccurences(arr, x));
    }
}