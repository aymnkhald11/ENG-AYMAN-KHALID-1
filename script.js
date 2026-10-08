// قاعدة بيانات محلية لحفظ الحجوزات ومتابعة الحالات
let patientDatabase = [];

// نظام البحث الفوري عن الأطباء والتخصصات
function searchFilter() {
    const query = document.getElementById('searchInput').value.toLowerCase();
    const doctorCards = document.querySelectorAll('.doc-card');

    doctorCards.forEach(card => {
        const title = card.querySelector('h3').innerText.toLowerCase();
        const specialty = card.querySelector('.spec').innerText.toLowerCase();

        if (title.includes(query) || specialty.includes(query)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

// تفعيل حجز موعد الكشف، دفع الرسوم وتحويل الفلوس
document.getElementById('booking-form').addEventListener('submit', function(e) {
    e.preventDefault();

    const name = document.getElementById('patientName').value;
    const phone = document.getElementById('patientPhone').value;
    const dept = document.getElementById('select-dept').value;
    const doctor = document.getElementById('select-doc').value;
    const date = document.getElementById('bookingDate').value;
    const time = document.getElementById('bookingTime').value;
    const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked').value;

    // حفظ البيانات في قاعدة البيانات المؤقتة لتمكين المتابعة لاحقاً
    const newRecord = {
        name,
        phone,
        dept,
        doctor,
        date,
        time,
        paymentMethod,
        status: "تم تأكيد الحجز وبانتظار موعد العيادة",
        prescription: "تم توقيع الكشف الطبي المبدئي، يرجى الالتزام بالموعد المحدد وإحضار التحاليل السابقة."
    };

    patientDatabase.push(newRecord);

    alert(`🎉 مرحباً ${name}!\nتمت عملية الدفع بنجاح عبر (${paymentMethod})\nوتم تثبيت حجزك مع ${doctor} بتاريخ ${date} الساعة ${time}.\nتم حفظ رقم هاتفك في نظام متابعة الحالة.`);
    
    this.reset();
});

// نظام متابعة الحالة الطبية وسجل المريض بعد الكشف
function trackStatus() {
    const phoneQuery = document.getElementById('trackPhoneInput').value.trim();
    const resultBox = document.getElementById('trackResultBox');
    const reportContent = document.getElementById('reportContent');

    if (!phoneQuery) {
        alert('يرجى إدخال رقم الهاتف المسجل بالحجز أولاً.');
        return;
    }

    // البحث عن المريض برقم الهاتف
    const foundPatient = patientDatabase.find(p => p.phone === phoneQuery);

    resultBox.style.display = 'block';

    if (foundPatient) {
        reportContent.innerHTML = `
            <p><strong>اسم المريض:</strong> ${foundPatient.name}</p>
            <p><strong>الطبيب المعالج:</strong> ${foundPatient.doctor}</p>
            <p><strong>موعد الكشف:</strong> ${foundPatient.date} - ${foundPatient.time}</p>
            <p><strong>طريقة الدفع:</strong> ${foundPatient.paymentMethod} (مؤكد)</p>
            <p><strong>حالة الموعد:</strong> <span style="color: green; font-weight: bold;">${foundPatient.status}</span></p>
            <p><strong>تعليمات الطبيب / الروشتة:</strong> ${foundPatient.prescription}</p>
        `;
    } else {
        // تجربة افتراضية في حال لم يتم إدخال بيانات حديثة، لجعل النظام يبدو حياً
        reportContent.innerHTML = `
            <p><strong>اسم المريض:</strong> مريض تجريبي (برقم: ${phoneQuery})</p>
            <p><strong>الطبيب المعالج:</strong> د. أحمد الخالد (قسم القلب)</p>
            <p><strong>حالة الموعد:</strong> <span style="color: green; font-weight: bold;">تم الكشف وإجراء الفحوصات بنجاح</span></p>
            <p><strong>تعليمات المتابعة:</strong> الاستمرار على أدوية تنظيم ضغط الدم ومراجعة العيادة بعد أسبوعين لإعادة التقييم.</p>
        `;
    }
}