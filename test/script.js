// Слушаем событие клика по кнопке "Создать сделку"
document.getElementById('sendToPipedrive').addEventListener('click', function() {
    // Получаем iframe по ID
    let iframe = document.getElementById("myIframe");
    
    // Получаем доступ к содержимому iframe (документ с формой)
    let iframeContent = iframe.contentWindow || iframe.contentDocument;
    
    // Убедимся, что содержимое загружено
    if (iframeContent.document) {
        iframeContent = iframeContent.document;
    }

    // Получаем данные формы из iframe
    let form = iframeContent.querySelector('.form-container');  // Здесь используется класс form-container
    if (!form) {
        console.error('Форма не найдена внутри iframe');
        return;
    }

    // Извлекаем данные формы
    let firstName = form.querySelector('input[name="First name"]');
    let lastName = form.querySelector('input[name="Last name"]');
    let phone = form.querySelector('input[name="Phone"]');
    let email = form.querySelector('input[name="Email"]');
    let jobType = form.querySelector('select[name="Job type"]');
    let jobSource = form.querySelector('select[name="Job source"]');
    let jobDescription = form.querySelector('textarea[name="Job description"]');
    let address = form.querySelector('input[name="Address"]');
    let city = form.querySelector('input[name="City"]');
    let state = form.querySelector('input[name="State"]');
    let zipCode = form.querySelector('input[name="Zip code"]');
    let area = form.querySelector('select[name="Area"]');
    let startDate = form.querySelector('input[name="Start date"]');
    let startTime = form.querySelector('input[name="Start time"]');
    let endTime = form.querySelector('input[name="End time"]');

    // Формируем объект для отправки в Pipedrive
    let dealData = {
        title: `${firstName} ${lastName}`, // Название сделки — имя клиента
        person_name: `${firstName} ${lastName}`,
        phone: phone,
        email: email,
        job_type: jobType,
        job_source: jobSource,
        job_description: jobDescription,
        address: address,
        city: city,
        state: state,
        zip_code: zipCode,
        area: area,
        start_date: startDate,
        start_time: startTime,
        end_time: endTime
    };

    // Вызов функции для отправки данных в Pipedrive
    createDeal(dealData);
});

// Функция для отправки данных в Pipedrive через API
async function createDeal(dealData) {
    const apiToken = 'f54fdf1d492ab074e1b142333233aa4db7f8361e';  // Вставьте сюда ваш API-токен Pipedrive
    const apiUrl = `https://alex4.pipedrive.com/deals?api_token=${apiToken}`;  // Замените на ваш домен

    try {
        let response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(dealData)  // Преобразуем объект с данными в JSON
        });

        if (!response.ok) {
            throw new Error('Ошибка при создании сделки');
        }

        let result = await response.json();
        console.log('Сделка успешно создана:', result);
    } catch (error) {
        console.error('Ошибка:', error);
    }
}
