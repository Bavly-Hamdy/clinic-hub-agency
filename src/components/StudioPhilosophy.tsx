export default function StudioPhilosophy() {
  const commitments = [
    {
      num: "01",
      title: "دقة المطبوعات وهندسة الورق",
      text: "الروشتة ليست مجرد ورقة؛ هي وثيقة قانونية وعلاجية. نحدد مقاسات الكتابة المريحة ليد الطبيب، هوامش آمنة للطباعة، وأوزان ورق مختارة بعناية تدوم في أيدي المرضى والصيادلة.",
    },
    {
      num: "02",
      title: "احترام أخلاقيات الإعلان الطبي",
      text: "نرفض الابتذال الإعلاني والعناوين الرخيصة. إعلاناتنا تحافظ على هيبة الطبيب ووقار التخصص، وتلتزم بالمعايير الأخلاقية ونصوص قوانين مزاولة المهنة دون تعريض حسابات العيادة للإغلاق.",
    },
    {
      num: "03",
      title: "مسار حجز مباشر وبدون تعقيد",
      text: "التصميم الممتاز هو الذي يحقق نتيجة واقعية. نربط كل مادة إعلانية أو روشتة بمسارات تواصل واضحة تقود المريض مباشرة إلى منسق العيادة على واتساب بضغطة زر واحدة.",
    },
  ];

  return (
    <section id="philosophy" className="relative border-b border-white/10 py-24 md:py-36 bg-[#0c0c0e]">
      <div className="mx-auto max-w-page px-6 md:px-10">
        <div className="grid gap-16 lg:grid-cols-12 items-start">
          {/* Left Column: Manifesto Quote */}
          <div className="lg:col-span-5">
            <span className="font-mono text-xs uppercase tracking-widest text-brass block mb-3">
              STANDARDS & ETHICS / 02
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold leading-tight text-paper">
              لماذا نرفض القوالب الجاهزة في تصميم العيادات؟
            </h2>
            <p className="mt-6 text-base text-stone-300 font-light leading-relaxed">
              المريض يبدأ تقييم جودة الرعاية الطبية من أول تفصيلة بصرية: مظهر الروشتة، وضوح التعليمات، وأسلوب الإعلان على المنصات. 
              التصميم الرديء يقلل من هيبة الطبيب، بينما الهوية المصممة بعناية تبني مكانة تليق بسنوات دراستك وخبرتك.
            </p>
          </div>

          {/* Right Column: Three Craft Pillars */}
          <div className="lg:col-span-7 divide-y divide-white/10 border-t border-b border-white/10">
            {commitments.map((c) => (
              <div key={c.num} className="py-8 grid grid-cols-1 sm:grid-cols-12 gap-4 items-baseline">
                <div className="sm:col-span-2">
                  <span className="font-mono text-xs text-brass">[{c.num}]</span>
                </div>
                <div className="sm:col-span-10">
                  <h3 className="text-xl font-bold text-paper mb-2">{c.title}</h3>
                  <p className="text-sm text-stone-400 font-light leading-relaxed">{c.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

