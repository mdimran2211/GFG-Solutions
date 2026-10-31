class Solution {
    public int maxWater(int arr[]) {
        // code here
        int left =0;
        int right = arr.length -1;
        int leftmx =0;
        int rightmx =0;
        int water =0;
        while(left<= right){
            if(arr[left] <= arr[right]){
                if(arr[left] >= leftmx){
                    leftmx = arr[left];
                }else{
                    water += leftmx - arr[left];
                }
                left++;
            } else{
                if(arr[right] >= rightmx){
                    rightmx = arr[right];
                }
                else{
                    water += rightmx - arr[right];
                }
                right--;
            }
        }
        return water;
    }
}
