const URL = {
  GROUPS: '/api/v1/category_groups',
  TRANSACTIONS: '/api/v1/transactions',
  MEMBERSHIPS: '/api/v1/category_group_memberships'
}
const ENTITIES= {
  GROUP: 'category_group',
  MEMBERSHIP: 'category_group_membership',
  TRANSACTION: 'transaction'
}

class DataService {
  
  static updateGroup(oldGroup, newGroup) {
    let groupId = oldGroup.id || oldGroup;
    let newName = newGroup.name || newGroup;
    let url = `${URL.GROUPS}/${groupId}`;
    let body = {};
    body[ENTITIES.GROUP] = {
      name: newName
    }
    return DataService.goFetch(url, "PATCH", body);
  }

  static createGroup(newGroup) {
    let newName = newGroup.name || newGroup;
    let url = `${URL.GROUPS}`;
    let body = {};
    body[ENTITIES.GROUP] = {
      name: newName
    }
    return DataService.goFetch(url, "POST", body);
  }

  static getGroups() {
    let url = `${URL.GROUPS}`;
    return DataService.goFetch(url, "GET", {});
  }

  static deleteGroup(group) {
    let groupId = oldGroup.id || oldGroup;
    let url = `${URL.GROUPS}/${groupId}`;
    let body = {};
    return DataService.goFetch(url, "DELETE", body);
  }

  static updateMembership(oldMembership, groupId) {
    let membershipId = oldMembership.id || oldMembership;
    let url = `${URL.MEMBERSHIPS}/${membershipId}`;
    let body = {};
    body[ENTITIES.MEMBERSHIP] = {
      category_group_id: groupId
    }
    return DataService.goFetch(url, "PATCH", body);
  }

  static createMembership(membership) {

  }

  static deleteMembership(membership) {

  }

  static getmemberships() {

  }

  static updateTransaction = (transaction, newValues) => {
      let url = `${URL.TRANSACTIONS}/${transaction.id}`;
      let body = {};
      body[ENTITIES.TRANSACTION] = newValues;
      return DataService.goFetch(url, "PATCH", body);
  }

  static goFetch = (url, method, body) => {
    return fetch(url, {
      method: method,
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

}

export default DataService;