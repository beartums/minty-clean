/* eslint-disable import/prefer-default-export */
import Transaction from '../models/Transaction';
import Category from '../models/Category';
import CategoryGroup from '../models/CategoryGroup';

export const transactionCollection = Transaction.collection;
export const categoryCollection = Category.collection;
export const groupCollection = CategoryGroup.collection;

export const INDICES = {
  TRANSACTIONS: {
    BY_ID: 'byId',
    BY_CATEGORY: 'byCategory',
  },
  CATEGORIES: {
    BY_GROUP_ID: 'byGroupId',
    BY_NAME: 'byName',
    BY_ID: 'byId',
    BY_ACCOUNT_NAME: 'byAccountName',
  },
  GROUPS: {
    BY_ID: 'byId',
  },
};

function isValidIndex(indexName, indexNameHash) {
  const validIndexNames = Object.values(indexNameHash);
  return validIndexNames.some((name) => name === indexName);
}

export function getGroup(groupId) {
  if (groupId !== 0 && !groupId) return groupCollection.items;
  return groupCollection.get(INDICES.GROUPS.BY_ID, { id: groupId });
}

export function getTransactions(indexName, lookupObject) {
  if (!indexName || !lookupObject) return transactionCollection.items;

  if (!isValidIndex(indexName, INDICES.TRANSACTIONS)) {
    throw new Error(`Index "${indexName}" is not a valid Transaction Index`);
  }
  return transactionCollection.get(indexName, lookupObject);
}

export function getGroups(indexName, lookupObject) {
  if (!indexName || !lookupObject) return groupCollection.items;

  if (!isValidIndex(indexName, INDICES.GROUPS)) {
    throw new Error(`Index "${indexName}" is not a valid Group Index`);
  }
  return groupCollection.get(indexName, lookupObject);
}

export function getCategories(indexName, lookupObject) {
  if (!indexName || !lookupObject) return categoryCollection.items;

  if (!isValidIndex(indexName, INDICES.CATEGORIES)) {
    throw new Error(`Index "${indexName}" is not a valid Category Index`);
  }
  return categoryCollection.get(indexName, lookupObject);
}
