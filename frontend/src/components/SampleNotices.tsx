import { FileText } from "lucide-react";
import { t } from "../i18n/translations";

const SAMPLES = [
  {
    name: "Field Trip Permission Slip",
    description: "Science museum trip requiring parent signature and $12 fee",
    text: `Dear Parent/Guardian,

Your child's class will be visiting the City Science Museum on Thursday, March 20th, 2025. The bus will depart at 8:30 AM and return by 2:45 PM.

A fee of $12.00 covers admission and bus transportation. Please send cash or a check made payable to Lincoln Elementary PTA.

Students must bring a bag lunch (no glass containers). Please ensure your child wears comfortable walking shoes.

Please return the signed form below by Friday, March 15th. Students without a signed permission slip will remain at school with an alternative assignment.

If you have questions, contact Mrs. Johnson at ext. 204.

---
PERMISSION SLIP — City Science Museum Field Trip — March 20, 2025

I, _______________, give permission for my child _______________ to attend the field trip.

Emergency Contact: _______________  Phone: _______________

Parent/Guardian Signature: _______________  Date: _______________`,
  },
  {
    name: "Immunization Reminder",
    description: "Required vaccinations before start of school year",
    text: `IMPORTANT: Immunization Requirements for 2025-2026 School Year

Dear Families,

As we prepare for the upcoming school year, please be advised that all students must have current immunization records on file by September 1, 2025.

Required immunizations for students entering grades K-6:
- DTaP (Diphtheria, Tetanus, Pertussis): 5 doses
- Polio (IPV): 4 doses
- MMR (Measles, Mumps, Rubella): 2 doses
- Varicella (Chickenpox): 2 doses
- Hepatitis B: 3 doses

Students without complete records will not be permitted to attend classes until documentation is provided.

Free immunization clinics are available at the Oak Street Community Health Center (555-0147) every Tuesday and Thursday from 9 AM to 4 PM.

Please submit updated records to the school nurse's office, Room 102.

Thank you for helping us maintain a healthy school community.

Sincerely,
Nurse Williams
School Health Services`,
  },
  {
    name: "Lunch Program Notice",
    description: "Free/reduced lunch eligibility and application",
    text: `Free and Reduced-Price Meal Program — 2025-2026 Application

Dear Parent/Guardian,

Washington Elementary participates in the National School Lunch Program. Your child may qualify for free or reduced-price meals based on household size and income.

Current Income Guidelines (Annual):
- Household of 2: Free meals under $25,636 / Reduced under $36,482
- Household of 3: Free meals under $32,227 / Reduced under $45,874
- Household of 4: Free meals under $38,818 / Reduced under $55,266

How to apply:
1. Complete the attached application (one per household)
2. Return to the school cafeteria office by August 25, 2025
3. You will be notified of your status within 10 business days

Benefits of applying:
- Free or reduced-price breakfast and lunch daily
- May qualify your family for other assistance programs
- All applications are confidential

If your child currently receives free/reduced meals, you MUST reapply for the new school year. Last year's application expires September 30, 2025.

Questions? Contact the Food Services office at 555-0189 or cafeteria@washington.edu.`,
  },
];

interface Props {
  onSelect: (file: File) => void;
  language: string;
}

export default function SampleNotices({ onSelect, language }: Props) {
  const handleSelect = (text: string, name: string) => {
    const blob = new Blob([text], { type: "text/plain" });
    const file = new File([blob], `${name.toLowerCase().replace(/\s+/g, "-")}.txt`, {
      type: "text/plain",
    });
    onSelect(file);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <p className="text-sm font-medium text-sage-500 dark:text-sage-400 text-center mb-4">
        {t(language, "orTrySample")}
      </p>
      <div className="grid gap-3 sm:grid-cols-3">
        {SAMPLES.map((sample) => (
          <button
            key={sample.name}
            onClick={() => handleSelect(sample.text, sample.name)}
            className="text-left p-4 bg-white dark:bg-navy-800 border border-sage-300/50 dark:border-navy-600/50 rounded-2xl
                       hover:border-accent-300 dark:hover:border-accent-500/50 hover:shadow-card-hover
                       transition-all duration-200 group"
          >
            <div className="w-8 h-8 bg-sage-100 dark:bg-navy-700 rounded-lg flex items-center justify-center mb-3 group-hover:bg-accent-50 dark:group-hover:bg-accent-900/30 transition-colors">
              <FileText className="w-4 h-4 text-sage-400 dark:text-sage-500 group-hover:text-accent-500 transition-colors" />
            </div>
            <p className="text-sm font-semibold text-navy-600 dark:text-sage-100 group-hover:text-accent-600 dark:group-hover:text-accent-400 transition-colors">
              {sample.name}
            </p>
            <p className="text-xs text-sage-400 dark:text-sage-500 mt-1 leading-relaxed">
              {sample.description}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}
