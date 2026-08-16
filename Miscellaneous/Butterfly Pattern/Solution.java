import java.util.Scanner;

class GFG {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();

        
        for(int i = 1; i <= n; i++) {

            if(i == n) {
                for(int j = 1; j <= 2 * n - 1; j++) {
                    System.out.print("*");
                }
            } 
            else {
                for(int j = 1; j <= i; j++) {
                    System.out.print("*");
                }

                int spaces = 2 * (n - i) - 1;

                for(int j = 1; j <= spaces; j++) {
                    System.out.print(" ");
                }

                for(int j = 1; j <= i; j++) {
                    System.out.print("*");
                }
            }

            System.out.println();
        }

       
        for(int i = n - 1; i >= 1; i--) {

            for(int j = 1; j <= i; j++) {
                System.out.print("*");
            }
