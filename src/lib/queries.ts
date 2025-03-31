import { createClient, SaveAccountTypeEnum } from './generated-m1-client';

export type Account = {
  id: string;
  name: string;
  type: SaveAccountTypeEnum;
  balance: string;
};

export type Transaction = {
  date: Date;
  payee: string;
  amount: number;
};

export async function getAccounts(accessToken: string) {
  const client = createClient({
    url: 'https://lens.m1.com/graphql',
    headers: {
      authorization: `Bearer ${accessToken}`,
    },
  });

  const rawAccounts = await client.query({
    viewer: {
      save: {
        savings: {
          savingsAccounts: {
            pageInfo: {
              endCursor: true,
              hasNextPage: true,
              hasPreviousPage: true,
              startCursor: true,
            },
            edges: {
              cursor: true,
              node: {
                id: true,
                name: true,
                accountType: true,
                balances: {
                  currentBalance: true,
                },
              },
            },
          },
        },
      },
      // TODO: there is a world where we can get transactions from credit and borrow accounts
      // however I don't currently own any of these accounts to test with
      // credit: {
      //   activeAccount: {
      //     availableCredit: true,
      //     creditLimit: true,
      //     currentBalance: true,
      //     id: true,
      //   },
      // },
      // borrow: {
      //   borrowAccounts: {
      //     pageInfo: {
      //       endCursor: true,
      //       hasNextPage: true,
      //       hasPreviousPage: true,
      //       startCursor: true,
      //     },
      //     edges: {
      //       cursor: true,
      //       node: {
      //         id: true,
      //         accountCategory: true,
      //         investAccount: {
      //           id: true,
      //         },
      //         billDue: {
      //           startDate: true,
      //           endDate: true,
      //           dueDate: true,
      //           isDue: true,
      //           rateDescription: true,
      //           amount: true,
      //         },
      //         billUpcoming: {
      //           id: true,
      //           key: true,
      //           startDate: true,
      //           endDate: true,
      //           dueDate: true,
      //           totalInterestToDate: true,
      //           projectedTotalInterest: true,
      //         },
      //         creditAvailable: true,
      //         creditBorrowed: true,
      //         creditLimit: true,
      //         descriptor: true,
      //         rate: {
      //           ratePercent: true,
      //         },
      //       },
      //     },
      //   },
      // },
      // accounts: {
      //   pageInfo: {
      //     endCursor: true,
      //     hasNextPage: true,
      //     hasPreviousPage: true,
      //     startCursor: true,
      //   },
      //   edges: {
      //     cursor: true,
      //     node: {
      //       id: true,
      //       accountCategory: true,
      //       name: true,
      //       registration: true,
      //       balance: {
      //         totalValue: {
      //           value: true,
      //         },
      //       },
      //     },
      //   },
      // },
    },
  });

  const accounts: Account[] = [];

  rawAccounts.viewer.save?.savings?.savingsAccounts?.edges?.forEach((edge) => {
    const account = edge?.node;
    if (!account) return;

    accounts.push({
      id: account.id,
      name: account.name,
      type: account.accountType,
      balance: account.balances?.currentBalance ?? '??',
    });
  });

  return accounts;
}

export async function getTransactions({
  accessToken,
  first,
  accountId,
}: {
  accessToken: string;
  accountId: string;
  first: number;
}) {
  const client = createClient({
    url: 'https://lens.m1.com/graphql',
    headers: {
      authorization: `Bearer ${accessToken}`,
    },
  });

  const rawTransactions = await client.query({
    node: {
      __typename: true,
      __args: {
        id: accountId,
      },
      on_SavingsAccount: {
        id: true,
        transactions: {
          __args: {
            first: first,
            after: '',
          },
          pageInfo: {
            hasNextPage: true,
            hasPreviousPage: true,
            startCursor: true,
            endCursor: true,
          },
          edges: {
            cursor: true,
            node: {
              date: true,
              activityDate: true,
              summary: true,
              description: true,
              merchant: true,
              categoryLabel: true,
              amount: true,
            },
          },
        },
      },
    },
  });

  const transactions: Transaction[] = [];
  if (rawTransactions.node?.__typename !== 'SavingsAccount')
    return transactions;

  rawTransactions.node.transactions?.edges?.forEach((edge) => {
    const transaction = edge?.node;
    if (!transaction) return;

    transactions.push({
      date: new Date(transaction.date),
      payee: transaction.summary ?? '',
      amount: transaction.amount ?? 0,
    });
  });

  return transactions;
}
