const itemsApi = 'http://localhost:3000/items';

function app() {
  const date = new Date();
  let fullDate;
  const btnLogout = document.querySelector('.btn--logout');
  const txtUserName = document.querySelector('.username > span');
  const txtDate = document.querySelector('.date > span');
  const table = document.querySelector('table');
  const inputSearch = document.querySelector('.input-search');
  const btnAdd = document.querySelector('.btn--add');
  const btnUpdate = document.querySelector('.btn--update');
  const menuItems = document.querySelectorAll('.menu-items');
  const mainBottomItems = document.querySelectorAll('.main__bottom-items');
  let txtMaHang = document.querySelector('.txt-mahang');
  let txtTenHang = document.querySelector('.txt-tenhang');
  let txtSize = document.querySelector('.txt-size');
  let txtSoLuong = document.querySelector('.txt-soluong');
  let txtGia = document.querySelector('.txt-gia');

  const days = date.getDate().toString();
  const months = date.getMonth() + 1;
  const years = date.getFullYear();

  function handleClickEdit(itemId) {
    fetch(itemsApi)
      .then((res) => res.json())
      .then((items) => {
        for (let i = 0; i < items.length; i++) {
          const item = items[i];
          if (item.id == itemId) {
            txtMaHang.value = item.maHang;
            txtTenHang.value = item.tenHang;
            txtSize.value = item.size;
            txtSoLuong.value = item.soLuong;
            txtGia.value = item.gia;
            return;
          }
        }
      });
  }

  menuItems.forEach((item, i) => {
    item.onclick = function (e) {
      document.querySelector('.menu-items.active').classList.remove('active');
      e.target.classList.add('active');
      const mainBottomItemShow = document.querySelector('.main__bottom-items.show');
      if (mainBottomItemShow) {
        mainBottomItemShow.classList.remove('show');
      }
      mainBottomItems[i].classList.add('show');
      if (i == 1) {
        getItems((items) => {
          renderItems(items, undefined, 'ban', i);
        });
        const inputSearch = document.querySelectorAll('.input-search')[1];
        let timer;
        inputSearch.onkeyup = function () {
          clearTimeout(timer);
          timer = setTimeout(() => {
            getItems((items) => {
              renderItems(items, inputSearch.value.toLowerCase(), 'ban', i);
            });
          }, 800);
        };
      }
    };
  });

  table.onclick = function (e) {
    let subDot;
    if (
      e.target.closest('.dot') &&
      !e.target.closest('.dot > i') &&
      !e.target.closest('.sub-dot')
    ) {
      subDot = e.target.children[1];
    } else if (e.target.closest('.dot > i')) {
      subDot = e.target.nextElementSibling;
    }
    if (subDot) {
      subDot.classList.toggle('show');
      subDot.onclick = (event) => {
        if (event.target.closest('.btn--edit')) {
          const itemId = event.target.dataset.editid;
          localStorage.setItem('itemid', itemId);
          handleClickEdit(itemId);
          subDot.classList.remove('show');
        } else {
          const itemId = event.target.dataset.deleteid;
          DeleteItem(itemId);
        }
      };
    }
  };

  btnAdd.onclick = function () {
    const maHang = txtMaHang.value;
    const tenHang = txtTenHang.value;
    const size = txtSize.value;
    const soLuong = txtSoLuong.value;
    const gia = txtGia.value;
    if (maHang === '' || tenHang == '' || size == '' || soLuong == '' || gia == '') {
      alert('Không được để trống');
      return;
    }
    const soLuongInt = Number.parseInt(soLuong);
    const giaInt = Number.parseInt(gia);
    if (isNaN(soLuongInt)) {
      alert('Vui lòng nhập chữ số cho mục SỐ LƯỢNG.');
      return;
    }
    if (isNaN(giaInt)) {
      alert('Vui lòng nhập chữ số cho mục Gia.');
      return;
    }

    fetch(itemsApi)
      .then((res) => res.json())
      .then((items) => {
        for (let i = 0; i < items.length; i++) {
          const item = items[i];
          if (item.maHang.toLowerCase() === maHang.toLowerCase()) {
            return true;
          }
        }
      })
      .then((check) => {
        if (check) {
          alert('Mã hàng không được trùng!');
        } else {
          const formData = {
            maHang: maHang.toUpperCase(),
            tenHang: tenHang,
            size: size.toUpperCase(),
            soLuong: Number.parseInt(soLuong),
            gia: Number.parseFloat(gia),
          };

          createItem(formData, function () {
            getItems(renderItems);
          });
        }
      });
  };

  btnUpdate.onclick = function () {
    const maHang = txtMaHang.value;
    const tenHang = txtTenHang.value;
    const size = txtSize.value;
    const soLuong = txtSoLuong.value;
    const gia = txtGia.value;
    if (maHang === '' || tenHang == '' || size == '' || soLuong == '' || gia == '') {
      alert('Không được để trống');
      return;
    }
    const soLuongInt = Number.parseInt(soLuong);
    const giaInt = Number.parseInt(gia);
    if (isNaN(soLuongInt)) {
      alert('Vui lòng nhập chữ số cho mục SỐ LƯỢNG.');
      return;
    }
    if (isNaN(giaInt)) {
      alert('Vui lòng nhập chữ số cho mục Gia.');
      return;
    }

    fetch(itemsApi)
      .then((res) => res.json())
      .then((items) => {
        const itemId = JSON.parse(localStorage.getItem('itemid'));
        for (let i = 0; i < items.length; i++) {
          const item = items[i];
          if (item.maHang.toLowerCase() === maHang.toLowerCase() && item.id !== itemId) {
            return true;
          }
        }
      })
      .then((check = false) => {
        if (check) {
          alert('Mã hàng không được trùng!');
        } else {
          const itemId = JSON.parse(localStorage.getItem('itemid'));
          handleUpdateItem(itemId);
        }
      });
  };

  function handleUpdateItem(id) {
    const newItem = {
      maHang: txtMaHang.value,
      tenHang: txtTenHang.value,
      size: txtSize.value,
      soLuong: txtSoLuong.value,
      gia: txtGia.value,
    };
    UpdateItem(id, newItem);
  }

  let timer;
  inputSearch.onkeyup = function () {
    clearTimeout(timer);
    timer = setTimeout(() => {
      getItems((items) => {
        renderItems(items, inputSearch.value.toLowerCase());
      });
    }, 800);
  };

  // full date
  fullDate = days.toString() + '/' + months.toString() + '/' + years.toString();
  txtDate.innerText = fullDate;

  // render items
  getItems(renderItems);

  // handle click btn logout
  btnLogout.onclick = function () {
    const isLogout = confirm('Bạn có muốn đăng xuất không?');
    if (isLogout) window.location = 'http://127.0.0.1:5500/Project/QLBH/login.html';
  };

  txtUserName.innerText = localStorage.getItem('username');
}

function createItem(data, callback) {
  var options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  };
  fetch(itemsApi, options)
    .then((response) => response.json())
    .then(callback);
}

function DeleteItem(id) {
  var options = {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  };
  fetch(itemsApi + '/' + id, options)
    .then((res) => res.json())
    .then(function () {
      getItems(renderItems);
    });
}

function UpdateItem(id, data) {
  var options = {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  };
  fetch(itemsApi + '/' + id, options)
    .then((res) => res.json())
    .then(function () {
      getItems(renderItems);
    });
}

function getItems(callback) {
  fetch(itemsApi)
    .then((res) => res.json())
    .then(callback);
}

function renderItems(items, inputValue, type = 'kho', index = 0) {
  const listItemsBlock = document.querySelectorAll('.list-items')[index];
  const rowTable = (item) => {
    return `
      <tr>
          <td class='test'>${item.maHang}</td>
          <td>${item.tenHang}</td>
          <td>${item.size}</td>
          <td>${item.soLuong}</td>
          <td>${item.gia}</td>
          <td>
          ${
            type.includes('kho') == true
              ? `<span class="dot">
                  <i class="fa-solid fa-ellipsis-vertical"></i>
                  <div class="sub-dot">
                    <span data-editid="${item.id}" class="btn--edit">Chỉnh sửa</span>
                    <span data-deleteid="${item.id}" class="btn--delete">Xoá</span>
                  </div>
                </span>`
              : `<span class="add" data-id="${item.id}">
                  <i class="fa-solid fa-plus"></i>
                </span>`
          }
            
          </td>
      </tr>
    `;
  };
  const htmls = items.map((item) => {
    if (typeof inputValue == 'undefined') {
      return rowTable(item);
    } else if (
      item.maHang.toLowerCase().includes(inputValue) ||
      item.tenHang.toLowerCase().includes(inputValue) ||
      item.size.toString().toLowerCase().includes(inputValue) ||
      item.soLuong.toString().toLowerCase().includes(inputValue) ||
      item.gia.toString().toLowerCase().includes(inputValue)
    ) {
      return rowTable(item);
    }
  });

  listItemsBlock.innerHTML = htmls.join('');
}

app();
