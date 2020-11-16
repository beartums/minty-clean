/* eslint-disable arrow-body-style */
/* eslint-disable no-else-return */
import { Settings, KEYS } from './settings';

const URL = {
  GROUPS: '/api/v1/category_groups',
  TRANSACTIONS: '/api/v1/transactions',
  MEMBERSHIPS: '/api/v1/category_group_memberships',
  USERS: '/api/v1/users',
  LOGIN: '/api/v1/login',
  RESET: '/api/v1/request_password_reset',
  REFRESH: '/api/v1/refresh_mah_token',
};
const ENTITIES = {
  GROUP: 'category_group',
  MEMBERSHIP: 'category_group_membership',
  TRANSACTION: 'transaction',
  USER: 'user',
};
const BODY_TYPE = {
  FORM: 'form',
  JSON: 'json',
};
const HEADERS = {
  JSON: {
    'Content-Type': 'application/json',
    'Key-Inflection': 'camel',
  },
};

class RestClient {
  static updateGroup(oldGroupOrId, newGroupOrName) {
    const groupId = oldGroupOrId.id || oldGroupOrId;
    const newName = newGroupOrName.name || newGroupOrName;
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

  static uploadTransactions = (file, overwrite) => {
    const formData = new FormData();
    formData.append('file', file);
    const url = `${URL.TRANSACTIONS}/import?overwrite=${overwrite || 'false'}`;
    return RestClient.goFetch(url, 'POST', formData, BODY_TYPE.FORM);
  }

  static deleteTransaction = (transaction) => {
    const { id } = transaction;
    const url = `${URL.TRANSACTIONS}/${id}`;
    const body = {};
    body[ENTITIES.TRANSACTION] = transaction;
    return RestClient.goFetch(url, 'DELETE', body);
  }

  static getTransactionMinMaxDate() {
    const url = `${URL.TRANSACTIONS}/minmax`;
    return RestClient.goFetch(url, 'GET');
  }

  static postUser = (user) => {
    const url = URL.USERS;
    const body = {};
    body[ENTITIES.USER] = user;
    return RestClient.goFetch(url, 'POST', body);
  }

  static fetchLogin = (username, password) => {
    const body = { username, password };
    return RestClient.goFetch(`${URL.LOGIN}`, 'POST', body)
      .then((response) => {
        this.setTokens(response.data);
        return response;
      });
  }

  static fetchPasswordReset = (username) => {
    const body = { username };
    return RestClient.goFetch(`${URL.RESET}`, 'POST', body);
  }

  static refreshTokens = () => {
    const request = {
      method: 'POST',
      body: JSON.stringify({ refreshToken: Settings.get(KEYS.TOKENS.REFRESH) }),
      headers: HEADERS.JSON,
    };
    return fetch(URL.REFRESH, request).then((tokenResponse) => {
      return tokenResponse.json().then((tokens) => {
        this.setTokens(tokens);
        return tokenResponse;
      });
    });
  }

  static setAuthHeader = (request) => {
    request.headers.Authorization = `Bearer ${Settings.get(KEYS.TOKENS.AUTH)}`;
    return request;
  }

  static setTokens = (tokens) => {
    if (tokens.token) Settings.set(KEYS.TOKENS.AUTH, tokens.token);
    if (tokens.refreshToken) Settings.set(KEYS.TOKENS.REFRESH, tokens.refreshToken);
    if (tokens.username) Settings.set(KEYS.USER.USERNAME, tokens.username);
  }

  static clearTokens = () => {
    Settings.set(KEYS.TOKENS.AUTH, '');
    Settings.set(KEYS.TOKENS.REFRESH, '');
    Settings.set(KEYS.USER.USERNAME, '');
  }

  static returnResponse = (response, needRelogin) => {
    if (!response.ok) {
      if (needRelogin) window.location.replace('/login');
    }
    return response.json().then((data) => {
      response.data = data;
      return response;
    });
  }

  static goFetch = (url, method, body, bodyType) => {
    let request = {
      method,
    };
    if (bodyType === BODY_TYPE.FORM) {
      request.body = body;
    } else {
      request.body = JSON.stringify(body);
      request.headers = HEADERS.JSON;
    }
    request = this.setAuthHeader(request);

    return fetch(url, request).then((response) => {
      // if (response.status < 200 || response.status > 299) throw new Error(response);
      if (response.status === 401) {
        if (Settings.get(KEYS.TOKENS.REFRESH)) {
          return this.refreshTokens()
            .then((refreshResponse) => {
              if (refreshResponse.ok) return this.returnResponse(fetch(url, request));
              else return this.returnResponse(refreshResponse, true);
            });
        } else return this.returnResponse(response, true);
      } else return this.returnResponse(response);
    });
  }
}

export default RestClient;
