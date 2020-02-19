let formDef1 = [
    { label: 'Название сайта:', kind: 'longtext', name: 'sitename' },
    { label: 'URL сайта:', kind: 'longtext', name: 'siteurl' },
    { label: 'Посетителей в сутки:', kind: 'number', name: 'visitors' },
    { label: 'E-mail для связи:', kind: 'shorttext', name: 'email' },
    { label: 'Рубрика каталога:', kind: 'combo', name: 'division', options: [
            { text: 'здоровье', value: 1 },
            { text: 'домашний уют', value: 2 },
            { text: 'бытовая техника', value: 3 }
        ]},
    { label: 'Pазмещение:', kind: 'radio', name: 'payment', options: [
            { text: 'бесплатное', value: 1 },
            { text: 'платное', value: 2 },
            { text: 'VIP', value: 3 }
        ]},
    { label: 'Разрешить отзывы:', kind: 'check', name: 'votes' },
    { label: 'Описание сайта:', kind: 'memo', name: 'description' },
    { label: 'Опубликовать', kind: 'submit' }
];
let formDef2 = [
    { label: 'Фамилия:', kind: 'longtext', name: 'lastname' },
    { label: 'Имя:', kind: 'longtext', name: 'firstname' },
    { label: 'Отчество:', kind: 'longtext', name: 'secondname' },
    { label: 'Возраст:', kind: 'number', name: 'age' },
    { label: 'Зарегистрироваться', kind: 'submit' }
];

function createForm(form, formDef) {
    let i = 0;
    for (let key of formDef) {
        let div = document.createElement('div');
        let label = document.createElement('label');
        form.appendChild(div).classList.add('div');
        div.appendChild(label).classList.add('label');
        label.innerText = key.label;
        switch (key.kind) {
            case 'longtext':
                createElem('text');
                break;
            case 'shorttext':
                createElem('email');
                break;
            case 'number':
                createElem('number');
                break;
            case 'check':
                createElem('checkbox');
                break;
            case 'combo':
                let select = document.createElement('select');
                div.appendChild(select).classList.add('select');
                select.name = key.name;
                select.id = select.name + i++;
                label.htmlFor = select.id;
                for (let item of key.options) {
                    let option = document.createElement('option');
                    select.appendChild(option);
                    option.innerText = item.text;
                    option.value = item.value;
                }
                break;
            case 'radio':
                let divRadio = document.createElement('div');
                div.appendChild(divRadio);
                for (let item of key.options) {
                    let input = document.createElement('input');
                    divRadio.appendChild(input);
                    input.name = 'position';
                    input.type = 'radio';
                    input.id = ++i;
                    let labelRadio = document.createElement('label');
                    divRadio.appendChild(labelRadio);
                    labelRadio.innerText = item.text;
                    labelRadio.htmlFor = i;
                }
                break;
            case 'memo':
                let textarea = document.createElement('textarea');
                div.appendChild(textarea).classList.add('textarea');
                textarea.name = key.name;
                textarea.id = textarea.name + i++;
                label.htmlFor = textarea.id;
                break;
            case 'submit':
                createElem('submit');
                div.removeChild(label);
                div.classList.remove('div');
                break;
        }

        function createElem(type) {
            let input = document.createElement('input');
            div.appendChild(input).classList.add('input');
            input.id = form.name + i++;
            label.htmlFor = input.id;
            input.type = type;
            input.name = key.name;
            if (key.kind === 'submit') {
                input.value = key.label;
            }
        }
    }
    document.body.appendChild(form);
};
let formes1 = document.forms.form1;
let formes2 = document.forms.form2;
createForm(formes1, formDef1);
createForm(formes2, formDef2);
