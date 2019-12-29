const URL = {
  GROUPS: '/api/v1/category_groups',
  TRANSACTIONS: '/api/v1/transactions',
  MEMBERSHIPS: '/api/v1/category_group_memberships',
};
const ENTITIES = {
  GROUP: 'category_group',
  MEMBERSHIP: 'category_group_membership',
  TRANSACTION: 'transaction',
};
const BODY_TYPE = {
  FORM: 'form',
  JSON: 'json',
};

class RestClient {
  static updateGroup(oldGroup, newGroup) {
    const groupId = oldGroup.id || oldGroup;
    const newName = newGroup.name || newGroup;
    const url = `${URL.GROUPS}/${groupId}`;
    const body = {};
    body[ENTITIES.GROUP] = {
      name: newName,
    };
    return RestClient.goFetch(url, 'PATCH', body);
  }

  static createGroup(newGroup) {
    const newName = newGroup.name || newGroup;
    const url = `${URL.GROUPS}`;
    const body = {};
    body[ENTITIES.GROUP] = {
      name: newName,
    };
    return RestClient.goFetch(url, 'POST', body);
  }

  static getGroups() {
    const url = `${URL.GROUPS}`;
    return RestClient.goFetch(url, 'GET');
  }

  static deleteGroup(group) {
    const groupId = group.id;
    const url = `${URL.GROUPS}/${groupId}`;
    const body = {};
    return RestClient.goFetch(url, 'DELETE', body);
  }

  static upsertCategory(oldCategory, newGroupId) {
    let method;
    const body = {};
    let url = `${URL.MEMBERSHIPS}`;
    const sendingCategory = {
      categoryGroupId: newGroupId,
      category: oldCategory.category,
    };

    if (oldCategory.id) {
      method = 'PATCH';
      url += `/${oldCategory.id}`;
    } else {
      method = 'POST';
    }
    body[ENTITIES.MEMBERSHIP] = sendingCategory;

    return RestClient.goFetch(url, method, body);
  }

  static getMemberships() {
    const url = `${URL.MEMBERSHIPS}`;
    return RestClient.goFetch(url, 'GET');
  }

  static updateTransaction = (transaction, newValues) => {
    const url = `${URL.TRANSACTIONS}/${transaction.id}`;
    const body = {};
    body[ENTITIES.TRANSACTION] = newValues;
    return RestClient.goFetch(url, 'PATCH', body);
  }

  static getTransactions = () => {
    const url = `${URL.TRANSACTIONS}/`;
    return RestClient.goFetch(url, 'GET');
  }

  static uploadTransactions = (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const url = `${URL.TRANSACTIONS}/import`;
    return RestClient.goFetch(url, 'POST', formData, BODY_TYPE.FORM);
  }

  static getTransactionMinMaxDate() {
    const url = `${URL.TRANSACTIONS}/minmax`;
    return RestClient.goFetch(url, 'GET');
  }

  static goFetch = (url, method, body, bodyType) => {
    const request = {
      method,
    };
    if (bodyType === BODY_TYPE.FORM) {
      request.body = body;
    } else {
      request.body = JSON.stringify(body);
      request.headers = {
        'Content-Type': 'application/json',
        'Key-Inflection': 'camel',
      };
    }

    return fetch(url, request).then((response) => {
      if (response.status !== 200) throw new Error(response);
      return response.json();
    });
  }
}

export default RestClient;
