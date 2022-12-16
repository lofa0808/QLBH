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
  let txtMaHang = document.querySelector('.txt-mahang');
  let txtTenHang = document.querySelector('.txt-tenhang');
  let txtSize = document.querySelector('.txt-size');
  let txtSoLuong = document.querySelector('.txt-soluong');
  let txtGia = document.querySelector('.txt-gia');

  const days = date.getDate().toString();
  const months = date.getMonth() + 1;
  const years = date.getFullYear();

  table.onclick = function (e) {
    function handleClickEdit(itemId) {
      fetch(itemsApi)
        .then((res) => res.json())
        .then((items) => {
          items.forEach((item) => {
            if (item.id == itemId) {
              const itemEdit = {
                maHang: item.maHang,
                tenHang: item.tenHang,
                size: item.size,
                soLuong: item.soLuong,
                gia: item.gia,
              };
              localStorage.setItem('itemEdit', JSON.stringify(itemEdit));
            }
          });
        });
      const itemEdit = JSON.parse(localStorage.getItem('itemEdit'));
      txtMaHang.value = itemEdit.maHang;
      txtTenHang.value = itemEdit.tenHang;
      txtSize.value = itemEdit.size;
      txtSoLuong.value = itemEdit.soLuong;
      txtGia.value = itemEdit.gia;
    }
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
    subDot.classList.toggle('show');
    subDot.onclick = (event) => {
      if (event.target.closest('.btn--edit')) {
        const itemId = event.target.dataset.editid;
        handleClickEdit(itemId);
        subDot.classList.remove('show');
      } else {
        const itemId = event.target.dataset.deleteid;
        hanleDeleteItem(itemId);
      }
    };
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

    const data = fetch(itemsApi)
      .then((res) => res.json())
      .then((items) => {
        // for (let i = 0; i < items.length; i++) {
        //   const item = items[i];
        //   if (item.maHang.toLowerCase() === maHang.toLowerCase()) {
        //     localStorage.setItem('check', 1);
        //     alert('Mã hàng không được trùng nhau.');
        //     break;
        //   }
        // }
        return items;
      });

    let check = false;
    data.then((items) => {
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (item.maHang.toLowerCase() === maHang.toLowerCase()) {
          check = true;
          alert('Mã hàng không được trùng nhau.');
          break;
        }
      }
    });

    console.log(check);

    const formData = {
      maHang: maHang.toUpperCase(),
      tenHang: tenHang,
      size: size.toUpperCase(),
      soLuong: Number.parseInt(soLuong),
      gia: Number.parseFloat(gia),
    };

    // const check = JSON.parse(localStorage.getItem('check'));

    // if (!check) {
    //   createItem(formData, function () {
    //     getItems(renderItems);
    //   });
    // }
  };

  // btnUpdate.onclick = function () {};

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

function hanleDeleteItem(id) {
  var options = {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  };
  fetch(itemsApi + '/' + id, options)
    .then((response) => response.json())
    .then(function () {
      getItems(renderItems);
    });
}

function getItems(callback) {
  fetch(itemsApi)
    .then((res) => res.json())
    .then(callback);
}

function renderItems(items, inputValue) {
  const listItemsBlock = document.querySelector('.list-items');
  const rowTable = (item) => {
    return `
      <tr>
          <td class='test'>${item.maHang}</td>
          <td>${item.tenHang}</td>
          <td>${item.size}</td>
          <td>${item.soLuong}</td>
          <td>${item.gia}</td>
          <td>
            <span class="dot">
              <i class="fa-solid fa-ellipsis-vertical"></i>
              <div class="sub-dot">
                <span data-editid="${item.id}" class="btn--edit">Chỉnh sửa</span>
                <span data-deleteid="${item.id}" class="btn--delete">Xoá</span>
              </div>
            </span>
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
