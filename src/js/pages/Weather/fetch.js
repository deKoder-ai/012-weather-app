'use strict';

class fetchFromApi {
  constructor(url, key, search) {
    this.url = url;
    this.key = key;
    this.search = search;
    this.request = `${url}${key}${search}`;
    return this;
  }
  fetchData = () => {
    fetch(this.request, {
      mode: 'cors',
    })
      .then(function (response) {
        return response.json();
      })
      // .then(function (response) {
      //   console.log(response);
      // })
      .catch(function (err) {
        console.log(err);
      });
  };
}

export { fetchFromApi };
