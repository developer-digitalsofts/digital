import { Link } from 'react-router-dom'
import { useI18n } from '../i18n/I18nProvider'
import { useSiteSettings } from '../cms/useSiteSettings'
import { pageShellClass } from '../ui/pageShell'
import { sectionPad } from '../ui/saas'

export function PrivacyPage() {
  const { lang } = useI18n()
  const site = useSiteSettings()

  const sections =
    lang === 'ar'
      ? [
          ['جمع المعلومات', 'نجمع معلومات التواصل التي تقدمها عبر نماذج الموقع — مثل الاسم والبريد الإلكتروني والهاتف والشركة — لمعالجة طلبات العروض والاستفسارات.'],
          ['استخدام المعلومات', 'نستخدم هذه المعلومات للرد على استفساراتك وتنسيق العروض التوضيحية وتقديم الدعم المتعلق بخدمات DigitalManager ERP.'],
          ['حماية البيانات', 'نطبق ضوابط عملية لحماية معلومات التواصل ونحدّ من الوصول إلى البيانات داخل فريقنا.'],
          ['ملفات تعريف الارتباط', 'قد يستخدم الموقع ملفات تعريف الارتباط الأساسية وتحليلات متوافقة مع إعدادات المتصفح لتحسين تجربة التصفح.'],
          ['حقوقك', 'يمكنك طلب الوصول إلى معلومات التواصل التي قدمتها أو تصحيحها عبر التواصل معنا على البريد أدناه.'],
        ]
      : [
          ['Information we collect', 'We collect contact details you submit through website forms — such as name, email, phone, and company — to process demo requests and enquiries.'],
          ['How we use information', 'We use this information to respond to enquiries, coordinate product demos, and provide support related to DigitalManager ERP services.'],
          ['Data protection', 'We apply practical controls to protect contact information and limit internal access to submitted data.'],
          ['Cookies', 'The site may use essential cookies and privacy-conscious analytics compatible with browser settings to improve browsing experience.'],
          ['Your choices', 'You may request access to or correction of contact information you have submitted by contacting us using the email below.'],
        ]

  const title = lang === 'ar' ? 'سياسة الخصوصية' : 'Privacy Policy'
  const intro =
    lang === 'ar'
      ? 'توضح هذه الصفحة كيف تتعامل DigitalManager مع معلومات التواصل التي تقدمها عبر الموقع.'
      : 'This page explains how DigitalManager handles contact information you provide through the website.'

  return (
    <main className="bg-white">
      <section className="border-b border-slate-200 bg-slate-50/50">
        <div className={`${pageShellClass} ${sectionPad}`}>
          <h1 className="font-heading text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">{title}</h1>
          <p className="mt-4 max-w-3xl text-base leading-[1.65] text-slate-600">{intro}</p>
        </div>
      </section>

      <section className={`${pageShellClass} ${sectionPad}`}>
        <div className="max-w-3xl space-y-8">
          {sections.map(([heading, body]) => (
            <div key={heading}>
              <h2 className="font-heading text-lg font-bold text-slate-900">{heading}</h2>
              <p className="mt-2 text-base leading-[1.65] text-slate-600">{body}</p>
            </div>
          ))}
          <div>
            <h2 className="font-heading text-lg font-bold text-slate-900">{lang === 'ar' ? 'التواصل' : 'Contact'}</h2>
            <p className="mt-2 text-base leading-[1.65] text-slate-600">
              {lang === 'ar' ? 'لأسئلة الخصوصية، راسل' : 'For privacy questions, email'}{' '}
              <a href={`mailto:${site.primaryEmail || 'info@digitalmanager.ae'}`} className="font-semibold text-brand">
                {site.primaryEmail || 'info@digitalmanager.ae'}
              </a>
              .
            </p>
          </div>
        </div>
        <p className="mt-10">
          <Link to="/contact" className="font-semibold text-brand hover:text-brand-dark">
            {lang === 'ar' ? 'صفحة الاتصال' : 'Contact page'}
          </Link>
        </p>
      </section>
    </main>
  )
}
