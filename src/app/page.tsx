'use client';

import { useState } from 'react';
import { AlertCircle, Download, ExternalLink, HelpCircle } from 'lucide-react';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface Account {
  id: string;
  name: string;
  balance: number;
  type: string;
}

export default function M1FinanceExporter() {
  const [accessToken, setAccessToken] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [accounts, setAccounts] = useState<Account[] | null>(null);
  const [isExplanationOpen, setIsExplanationOpen] = useState(false);

  const fetchAccounts = async () => {
    setIsLoading(true);

    try {
      // This is a placeholder for the actual GraphQL query
      // Replace this with your actual implementation
      console.log('Using access token:', accessToken);

      // Simulate API call with timeout
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock data - replace with actual GraphQL query results
      const mockAccounts: Account[] = [
        { id: 'acc1', name: 'Roth IRA', balance: 12543.87, type: 'retirement' },
        { id: 'acc2', name: 'Checking', balance: 3254.12, type: 'cash' },
        {
          id: 'acc3',
          name: 'Investment',
          balance: 8765.43,
          type: 'investment',
        },
      ];

      setAccounts(mockAccounts);
    } catch (error) {
      console.error('Error fetching accounts:', error);
      // Handle error appropriately
    } finally {
      setIsLoading(false);
    }
  };

  const exportAccount = async (accountId: string, accountName: string) => {
    // This is a placeholder for the actual export functionality
    // Replace this with your actual implementation
    console.log(`Exporting account ${accountId}`);

    try {
      // Simulate API call with timeout
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Mock CSV data - replace with actual data formatting
      const csvContent = `Date,Description,Amount
2023-01-15,Deposit,1000.00
2023-01-22,Dividend,25.43
2023-02-05,Withdrawal,-150.00`;

      // Create and download the CSV file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute(
        'download',
        `${accountName.replace(/\s+/g, '_')}_transactions.csv`,
      );
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error exporting account:', error);
      // Handle error appropriately
    }
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      {/* "Why does this exist?" button */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">M1 to Simplifi</h1>
          <p className="text-lg text-muted-foreground">
            M1 Finance to Quicken Simplifi Transaction Exporter
          </p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsExplanationOpen(true)}
          className="flex items-center gap-1 text-muted-foreground hover:text-foreground"
        >
          <HelpCircle className="h-4 w-4" />
          Why does this exist?
        </Button>
      </div>

      {/* Explanation Modal */}
      <Dialog open={isExplanationOpen} onOpenChange={setIsExplanationOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Why This Tool Exists</DialogTitle>
            <DialogDescription>
              Addressing the connection issues between M1 Finance and Quicken
              Simplifi
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <p>
              This tool was created to solve a specific problem: Quicken
              Simplifi has stopped being able to retrieve data from Savings and
              Cash accounts from M1 Finance.
            </p>
            <p>
              Many users have reported issues with their M1 Finance accounts not
              syncing properly with Simplifi, particularly for money market
              accounts and cash balances.
            </p>
            <h3 className="font-medium mt-4">See the following:</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <a
                  href="https://community.simplifimoney.com/discussion/11225/m1-finance-not-showing-money-market-account-when-syncing"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary mt-1 underline inline-flex items-center gap-1"
                >
                  Simplifi Community Discussion{' '}
                  <ExternalLink className="h-3 w-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.reddit.com/r/M1Finance/comments/1i235gt/issues_connecting_to_simplifi/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary mt-1 underline inline-flex items-center gap-1"
                >
                  Reddit r/M1Finance <ExternalLink className="h-3 w-3" />
                </a>
              </li>
            </ul>
            <p className="text-sm text-muted-foreground mt-4">
              This tool allows you to manually export your M1 Finance
              transactions in a format that can be imported into Quicken
              Simplifi, bypassing the broken automatic sync.
            </p>
          </div>
        </DialogContent>
      </Dialog>

      <Alert variant="destructive" className="mb-8">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Security Warning</AlertTitle>
        <AlertDescription>
          <span>
            I&apos;m a random person on the internet. Don&apos;t trust random
            people on the internet. You can go to my{' '}
            <a
              href="https://github.com/johnslemmer/m1-simplifi"
              className="underline font-medium items-center gap-1 inline-flex"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub <ExternalLink className="h-3 w-3" />
            </a>{' '}
            to look at the code and even run it yourself, thus taking on very
            little risk with your sensitive authorization token. This tool runs
            completely in your browser - no data is sent to any server except
            M1.
          </span>
        </AlertDescription>
      </Alert>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Step 1: Get Your M1 Finance Access Token</CardTitle>
          <CardDescription>
            You&apos;ll need to obtain your access token from M1 Finance to
            proceed.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ol className="list-decimal pl-5 space-y-2">
            <li>
              In another tab, log in to{' '}
              <a
                href="https://m1.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline"
              >
                m1.com
              </a>
            </li>
            <li>
              Open your browser&apos;s developer console (F12 or right-click →
              Inspect → Console)
            </li>
            <li>
              Copy and paste the following code into the console and press
              Enter:
              <div className="bg-muted p-3 rounded-md my-2 font-mono text-sm overflow-x-auto">
                console.log(JSON.parse(sessionStorage.getItem(&quot;m1_finance_auth.accessToken&quot;)))
              </div>
            </li>
            <li>
              Copy the token that appears and paste it below. It should look
              something like:
              <div className="bg-muted p-3 rounded-md my-2 font-mono text-sm overflow-x-auto break-all">
                eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
              </div>
            </li>
          </ol>
        </CardContent>
      </Card>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Step 2: Enter Your Access Token</CardTitle>
          <CardDescription>
            Paste your M1 Finance access token here to retrieve your accounts.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Input
              type="password"
              placeholder="Paste your M1 Finance access token here"
              value={accessToken}
              onChange={(e) => setAccessToken(e.target.value)}
              className="font-mono"
            />
            <Button
              onClick={fetchAccounts}
              disabled={!accessToken || isLoading}
              className="w-full sm:w-auto"
            >
              {isLoading ? 'Loading...' : 'Get My Accounts'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Step 3 Card - Always visible but conditionally styled */}
      <Card className={`relative ${!accounts ? 'opacity-75' : ''}`}>
        <CardHeader>
          <CardTitle>Step 3: Export Account Transactions</CardTitle>
          <CardDescription>
            Select an account to export transactions in Quicken Simplifi format.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {accounts ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Account Name</TableHead>
                  <TableHead className="text-right">Balance</TableHead>
                  <TableHead className="text-right">Type</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {accounts.map((account) => (
                  <TableRow key={account.id}>
                    <TableCell className="font-medium">
                      {account.name}
                    </TableCell>
                    <TableCell className="text-right">
                      ${account.balance.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right capitalize">
                      {account.type}
                    </TableCell>
                    <TableCell className="flex justify-end">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => exportAccount(account.id, account.name)}
                        className="flex items-center gap-1"
                      >
                        <Download className="h-4 w-4" /> Export
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="py-8 text-center text-muted-foreground">
              No accounts to display yet.
            </div>
          )}
        </CardContent>
        <CardFooter className="text-sm text-muted-foreground">
          Exported files will be in CSV format compatible with Quicken Simplifi.
        </CardFooter>

        {/* Overlay that appears when no accounts are loaded */}
        {!accounts && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-[2px] rounded-lg">
            <div className="bg-primary text-primary-foreground px-4 py-2 rounded-md shadow-lg flex items-center">
              <AlertCircle className="h-4 w-4 mr-2" />
              First enter your access token above
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
