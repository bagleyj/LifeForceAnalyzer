#! /usr/bin/awk -f

# hlf is dollars per hour. Divide an amount by it and you get the hours it takes to earn it.
# For 2012, I gross 7892 per month. There are 21.67 work days per month average.
# I work 8 hours per day average giving $45.52/hour.
# Raise in September or October 2012?
BEGIN { FS = "\t"; hlf = 45.52; total = 0; energyTotal = 0; }



# Total the values, skipping any lines that don't look like a record
/.*\t.*\t.*\t.*/ {

# Get rid of the '$' character in the value column
    value = substr($4, 2);

    byDate[tolower($1)] += value

    byVendor[tolower($2)] += value;

    accountsString = tolower($3);
    numAccounts = split(accountsString, accounts, ",");
#  if (1 < numAccounts) {
	 for (account in accounts)
#	     print accounts[account];
	     byAccount[accounts[account]] += value;
#  }
 # else {
  #  byAccount[accountsString] += value;
#  }
  
    total += value;
    energyTotal += value / hlf
}

# Report lines that don't match the expected format to stderr.
$0 !~ /.*\t.*\t.*\t.*/     {   print "Bad format:" $0 | "cat 1>&2"; }

END { 
  print "\nGrand Total: $" total " energy " energyTotal;
#  DumpView(byDate, "Date", 10);
  DumpView(byAccount, "Account", 20);
  DumpView(byVendor, "Vendor", 20);
}

function DumpView(viewArray, arrayTitle, columnOneWidth)
{
# Print the sorted results
  printf("\n%-*s\tAmount\tEnergy\t%% Of Total\n", columnOneWidth, arrayTitle);
# Output sorted on the amount (+1.1), with largest amounts first (r), numerically compared (n
#  sortCommand = "sort -t '\t' +1nr -3";
  sortCommand = "sort -t '\t' -n -r -k3";
  for (key in viewArray) {
    value = viewArray[key];
    energy = value / hlf;
    printf("%-*s\t%7.2f\t%7.2f\t%.2f%%\n", columnOneWidth, key, value, energy, (energy / energyTotal) * 100) | sortCommand;
  }
  close(sortCommand);
}

function ClearArray(theArray)
{
  split("", theArray);
}


