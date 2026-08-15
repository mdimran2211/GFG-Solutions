class Solution {
    public static int[] lcmAndGcd(int a, int b) {
        // code here
        int x = a;
        int y = b;
       
        while (y != 0) {
            int temp = y;
            y = x % y;
            x = temp;
        }
        int gcd = x;
        
        int lcm = (a * b) / gcd;
        return new int[]{lcm, gcd};
    }
}
