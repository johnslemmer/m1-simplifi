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
import { toast } from 'sonner';
import { getAccounts, type Account, getTransactions } from '@/lib/queries';
import { toCSVString } from '@/lib/csv';

export default function M1FinanceExporter() {
  const [accessToken, setAccessToken] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [accounts, setAccounts] = useState<Account[] | null>(null);
  const [isExplanationOpen, setIsExplanationOpen] = useState(false);
  const [isTokenExplanationOpen, setIsTokenExplanationOpen] = useState(false);
  const [transactionCount, setTransactionCount] = useState(50);
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);
  const [selectedAccountId, setSelectedAccountId] = useState<string | null>(
    null,
  );
  const [selectedAccountName, setSelectedAccountName] = useState<string | null>(
    null,
  );

  const fetchAccounts = async () => {
    setIsLoading(true);

    try {
      const accounts = await getAccounts(accessToken);
      setAccounts(accounts);
    } catch (error) {
      console.error('Error fetching accounts:', error);
      toast.error(
        'Error fetching accounts. Please check your access token and try again.',
      );
    } finally {
      setIsLoading(false);
    }
  };

  const exportAccount = async (accountId: string, accountName: string) => {
    setIsExporting(true);

    try {
      const transactions = await getTransactions({
        accessToken,
        accountId,
        first: transactionCount,
      });
      const csvContent = toCSVString(transactions);
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
      toast.error('Error exporting account. Please try again later.');
    } finally {
      setIsExporting(false);
      setIsExportDialogOpen(false);
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

      <Dialog
        open={isTokenExplanationOpen}
        onOpenChange={setIsTokenExplanationOpen}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>About the Access Token</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p>
              This is a limited-use key to access your M1 Finance account. This
              tool uses it to retrieve your account information and
              transactions.
            </p>
            <div className="bg-muted p-4 rounded-lg">
              <h3 className="font-medium mb-2">
                Why not just use my login email and password?
              </h3>
              <p className="text-sm">
                Because you shouldn&apos;t trust random people on the internet
                with that information. At least this token has an expiration,
                meaning it could only potentially be misused for a few hours.
              </p>
            </div>
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
            little risk with your sensitive information. This tool runs
            completely in your browser - no data is sent to any server except
            M1. But again, don&apos;t trust random people on the internet.
          </span>
        </AlertDescription>
      </Alert>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex justify-between">
            Step 1: Get Your M1 Finance Access Token
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsTokenExplanationOpen(true)}
              className="flex items-center gap-1 text-muted-foreground hover:text-foreground p-0 h-auto mb-2"
            >
              <HelpCircle className="h-4 w-4" />
              <span className="hidden sm:block">
                What is this and why do you need it?
              </span>
              <span className="block sm:hidden">What is this?</span>
            </Button>
          </CardTitle>
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
          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <Input
              placeholder="Paste your M1 Finance access token here"
              value={accessToken}
              disabled={isLoading}
              onChange={(e) => setAccessToken(e.target.value)}
              className="font-mono"
            />
            <Button
              type="submit"
              onClick={fetchAccounts}
              disabled={!accessToken || isLoading}
              className="w-full sm:w-auto"
            >
              {isLoading ? 'Loading...' : 'Get My Accounts'}
            </Button>
          </form>
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
                      {account.balance}
                    </TableCell>
                    <TableCell className="text-right capitalize">
                      {account.type}
                    </TableCell>
                    <TableCell className="flex justify-end">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedAccountId(account.id);
                          setSelectedAccountName(account.name);
                          setIsExportDialogOpen(true);
                        }}
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
        <CardFooter className="text-sm text-muted-foreground flex-col">
          <span>
            Exported files will be in CSV format compatible with Quicken
            Simplifi.
          </span>
          <span>
            See Simplifi's documentation on{' '}
            <a
              href="https://support.simplifi.quicken.com/en/articles/4413430-how-to-manually-import-transactions#h_a40057a0e7"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary mt-1 underline inline-flex items-center gap-1"
            >
              how to import <ExternalLink className="h-3 w-3" />
            </a>
            .
          </span>
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

      <Dialog open={isExportDialogOpen} onOpenChange={setIsExportDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Export Transactions</DialogTitle>
            <DialogDescription>
              How many recent transactions would you like to export?
            </DialogDescription>
          </DialogHeader>
          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <Input
              type="number"
              min="1"
              max="1000"
              value={transactionCount}
              disabled={isExporting}
              onChange={(e) => setTransactionCount(Number(e.target.value))}
            />
            <div className="flex justify-end gap-2">
              <Button
                type="reset"
                variant="outline"
                onClick={() => setIsExportDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isExporting}
                onClick={() => {
                  if (selectedAccountId && selectedAccountName) {
                    exportAccount(selectedAccountId, selectedAccountName);
                  }
                }}
              >
                {isExporting ? 'Downloading...' : 'Export'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
