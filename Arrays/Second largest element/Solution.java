import java.util.*;
public class Solution{
    public static int SecondLargest(int [] arr){
        int Largest = Integer.MIN_VALUE;
        int SecondLargest = Integer.MIN_VALUE;
        for(int i=0; i<arr.length; i++){
            if(arr[i]>Largest){
                SecondLargest = Largest;
                Largest = arr[i];

            }else if(arr[i] > SecondLargest && arr[i]!= Largest){
                SecondLargest = arr[i];
            }
            
        }
        return SecondLargest;
    }
    public static void main(String[] args){
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int arr[] = {10,20,5,8,3};
        System.out.print(SecondLargest(arr));
    }
}