import java.util.*;
class Solution {
    static int product(int x, int y) {
        // code here
        return x*y;
    }
    public static void main(String[] args){
        Scanner sc = new Scanner(System.in);
        int x = sc.nextInt();
        int y = sc.nextInt();
        System.out.print(product(x,y));
    }
}
