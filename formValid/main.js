let formDef1 = [
    { label: 'Название сайта:', kind: 'longtext', name: 'sitename' },
    { label: 'URL сайта:', kind: 'longtext', name: 'siteurl' },
    { label: 'Посетителей в сутки:', kind: 'number', name: 'visitors' },
    { label: 'E-mail для связи:', kind: 'shorttext', name: 'email' },
    {
        label: 'Рубрика каталога:', kind: 'combo', name: 'division',
        variants: [{ text: 'здоровье', value: 1 }, { text: 'домашний уют', value: 2 }, { text: 'бытовая техника', value: 3 }]
    },
    {
        label: 'Размещение:', kind: 'radio', name: 'payment',
        variants: [{ text: 'бесплатное', value: 1 }, { text: 'платное', value: 2 }, { text: 'VIP', value: 3 }]
    },
    { label: 'Разрешить отзывы:', kind: 'check', name: 'votes' },
    { label: 'Описание сайта:', kind: 'memo', name: 'description' },
    { label: 'Опубликовать', kind: 'submit' },
];

function createForm(formdef) {
    let form = document.createElement('form');
    form.method = 'post';
    form.action = 'https://fe.it-academy.by/TestForm.php';
    document.body.prepend(form);

    for (let item of formdef) {
        let div = document.createElement('div');
        div.classList.add('form');
        let label = document.createElement('label');
        label.append(item.label);

        function addInput(kind) {
            let input = document.createElement('input');
            input.name = item.name;
            input.type = kind;
            div.append(label, input);
        }
        function addSelect() {
            let select = document.createElement('select');
            select.name = item.name;
            div.append(label, select);
            for (let selectItem of item.variants) {
                let option = new Option(selectItem.text, selectItem.value);
                select.append(option);
            }
        }
        function addRadio() {
            div.append(label);
            let divRadio = document.createElement('div');
            divRadio.classList.add('radio');
            for (let radioItem of item.variants) {
                let input = document.createElement('input');
                input.type = item.kind;
                input.name = item.name;
                input.value = radioItem.value;

                label = document.createElement('label');
                label.append(input, radioItem.text);
                divRadio.append(label);
            }
            div.append(divRadio);
        }

        function addTextarea() {
            let textarea = document.createElement('textarea');
            textarea.name = item.name;
            div.append(label, textarea);
        }
        function addSubmit() {
            let input = document.createElement('input');
            input.type = 'submit';
            input.value = item.label;
            div.append(input);
        }
        switch (item.kind) {
            case 'longtext':
                addInput('text');
                break;
            case 'number':
                addInput('number');
                break;
            case 'check':
                addInput('checkbox');
                break;
            case 'combo':
                addSelect();
                break;
            case 'radio':
                addRadio();
                break;
            case 'memo':
                addTextarea();
                break;
            case 'submit':
                addSubmit();
                break;
        }
        form.append(div);
    }
}
createForm(formDef1);

let validText = document.forms[0].querySelectorAll('[type=text]');
let validNumber = document.forms[0].querySelectorAll('[type=number]');
let validEmail = document.forms[0].querySelectorAll('[type=email]');
let validRadio = document.forms[0].querySelectorAll('[type=radio]');
let validTAreas = document.forms[0].querySelectorAll('textarea');
let itemList = [...validText, ...validNumber, ...validEmail, ...validRadio, ...validTAreas];
let validated;
let dec;

function validation(item) {
    if (!validated) {
        item.classList.add('wrong');
        if (!item.nextElementSibling) {
            item.insertAdjacentHTML('afterend', `<p class="error-message">${dec}</p>`)
        }
    } else {
        item.classList.remove('wrong');
        if (item.nextElementSibling) {
            item.nextElementSibling.remove();
        }
    }
}

function formLength(item) {
    if (!item.value) {
        validated = false;
        dec = 'Нельзя оставлять пустую строку';
    } else {
        validated = true;
    }
    validation(item);
}

function numberValid(item) {
    if (item.type === 'number' && (item.value <= 0 || item.value === '')) {
        validated = false;
        dec = 'Введите значене больше 0';
    } else {
        validated = true;
    }
    validNumber.forEach(function (input) {
        validation(input);
    });
}

function emailValid(item) {
    if (item.type === 'email' && !item.value.match('.@')) {
        validated = false;
        dec = 'Введите корректный Email';
    } else {
        validated = true;
    }
    validEmail.forEach(function (input) {
        validation(input);
    });
}

function radioValid(item) {
    let checkedItems = document.forms[0].querySelectorAll('input[type=radio]:checked');
    if (item.type === 'radio' && !checkedItems.length) {
        validated = false;
        dec = 'Выберите вариант';
    } else {
        validated = true;
    }
    let radioStyle = document.forms[0].querySelector('.radio');
    validation(radioStyle);
}

function checkAllitems(item) {
    formLength(item);
    switch (item.type) {
        case 'number':
            numberValid(item);
            break;
        case 'email':
            emailValid(item);
            break;
        case 'radio':
            radioValid(item);
            break;
    }
}

itemList.forEach(function (item) {
    item.addEventListener('blur', function () {
        checkAllitems(item);
    });
});

let submit = document.forms[0].querySelector('[type=submit]');
submit.addEventListener('click', function (event) {
    itemList.forEach(function (item) {
        checkAllitems(item);
        if (!validated) {
            event.preventDefault();
            document.querySelector('.wrong').focus();
        }
    });
});