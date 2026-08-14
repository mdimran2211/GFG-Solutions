class Solution {
    static String armstrongNumber(int n) {
        int temp = n;
        //Step 1: Store the original number to compare later
        
        int res = 0;
        //Step 2: Variable to store the sum of the cubes of the digits
        
        while (n != 0) 
        {
            //Step 3: Loop to process each digit of the number
            
            int digit = n % 10;
            //Step 4: Get the last digit of the number
            
            res += Math.pow(digit, 3);
            // Step 5: Add the cube of the digit to the result
            
            n /= 10;
            // Step 6: Remove the last digit from the number
        }
        // Step 7: Check if the sum of cubes (res) is equal to the original number or not
        if (res == temp) 
        {
            return "true";   // The number is an Armstrong number
        } 
        else
        {
            return "false";  // The number is not an Armstrong number
        }
    }
}
class Solution:
    def armstrongNumber (self, n):
        # code here 
        temp = n
        # Step 1: Store the original number to compare later
        
        res = 0
        # Step 2: Variable to store the sum of the cubes of the digits
        
        while n != 0:
            # Step 3: Loop to process each digit of the number
            
            digit = n % 10
            # Step 4: Get the last digit of the number
            
            res += digit ** 3
            # Step 5: Add the cube of the digit to the result
            
            n //= 10
            # Step 6: Remove the last digit from the number
        
        # Step 7: Check if the sum of cubes (res) is equal to the original number or not
        if res == temp:
            return "true"  # The number is an Armstrong number
        else:
            return "false"  # The number is not an Armstrong number

class Solution {
	static boolean armstrongNumber(int n) {
		// code here
		int mo = (int)Math.log10(n) + 1; // total digit in number 
		
		int sum = 0; int num = n;
		
		while (num > 0) {
			int ld = num % 10; // store lastdigit
			sum = sum + (int)Math.pow(ld , mo);
			num /= 10; // remove lastdigit
		}
		
		if (n == sum) {
			return true;
			
		} else {
			return false;
		}
	}
}
