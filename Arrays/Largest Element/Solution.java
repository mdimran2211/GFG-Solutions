import java.util.*;
public class Solution{
    public static int largestElement(int [] arr){
        int largest = arr[0];
        for(int i=0; i<arr.length; i++){
            if(arr[i] >largest){
                largest = arr[i];
            }
        }
        return largest;
    }
    public static void main(String[] args){
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int [] arr = {2,4,6,7,8,3};
        System.out.print(largestElement(arr));
    }
}
