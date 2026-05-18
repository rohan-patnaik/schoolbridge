"""Generate synthetic training data for SchoolBridge fine-tuning.

Produces JSONL files in ShareGPT/chat format for Unsloth training.
Three task families:
  1. Notice → structured JSON extraction
  2. Notice → plain-language explanation (multilingual)
  3. QA with grounded evidence (including negative examples)
"""

import json
import random
import os
from datetime import datetime, timedelta
from pathlib import Path

random.seed(42)

TEMPLATES_DIR = Path(__file__).parent / "data" / "templates"
OUTPUT_DIR = Path(__file__).parent / "data"

LANGUAGES = {
    "en": "English",
    "es": "Spanish",
    "zh": "Chinese (Simplified)",
    "ar": "Arabic",
    "hi": "Hindi",
    "fr": "French",
}

DOC_TYPES = [
    "field_trip_permission",
    "photo_consent",
    "health_notice",
    "immunization_reminder",
    "fee_notice",
    "event_announcement",
    "schedule_change",
    "policy_update",
    "attendance_warning",
    "lunch_program",
    "meeting_invitation",
    "fundraising",
]

URGENCY_MAP = {
    "field_trip_permission": "high",
    "photo_consent": "medium",
    "health_notice": "high",
    "immunization_reminder": "high",
    "fee_notice": "high",
    "event_announcement": "low",
    "schedule_change": "medium",
    "policy_update": "low",
    "attendance_warning": "high",
    "lunch_program": "medium",
    "meeting_invitation": "medium",
    "fundraising": "low",
}

SCHOOL_NAMES = [
    "Lincoln Elementary", "Washington Middle School", "Jefferson Academy",
    "Roosevelt Primary", "Franklin Elementary", "Madison School",
    "Hamilton Academy", "Adams Elementary", "Monroe School", "Jackson Primary",
]

TEACHER_NAMES = [
    "Mrs. Johnson", "Mr. Garcia", "Ms. Chen", "Mr. Williams", "Mrs. Patel",
    "Ms. Thompson", "Mr. Lee", "Mrs. Martinez", "Ms. Anderson", "Mr. Kim",
]

CHILD_GRADES = ["Kindergarten", "1st grade", "2nd grade", "3rd grade",
                "4th grade", "5th grade", "6th grade"]

DESTINATIONS = [
    "City Science Museum", "Natural History Museum", "Riverside Nature Center",
    "Fire Station #7", "Downtown Library", "Botanical Gardens",
    "Children's Theater", "Planetarium", "Zoo", "Art Museum",
]

SYSTEM_PROMPT = (
    "You are SchoolBridge, a school notice analyzer. "
    "Extract structured information from school notices and respond in valid JSON only."
)


def random_date(start_days=7, end_days=90):
    d = datetime.now() + timedelta(days=random.randint(start_days, end_days))
    return d.strftime("%Y-%m-%d")


def random_fee():
    return f"${random.choice([5, 8, 10, 12, 15, 20, 25])}.00"


def generate_field_trip():
    school = random.choice(SCHOOL_NAMES)
    teacher = random.choice(TEACHER_NAMES)
    dest = random.choice(DESTINATIONS)
    grade = random.choice(CHILD_GRADES)
    fee = random_fee()
    trip_date = random_date(14, 60)
    deadline = random_date(7, 13)

    notice = f"""Dear Parent/Guardian,

{grade} students at {school} will be visiting the {dest} on {trip_date}. The bus departs at {random.choice(['8:00', '8:30', '9:00'])} AM and returns by {random.choice(['2:00', '2:30', '2:45', '3:00'])} PM.

A fee of {fee} covers admission and transportation. Please send cash or check payable to {school} PTA.

Students must bring a bag lunch. Please ensure comfortable walking shoes.

Return the signed permission slip by {deadline}. Students without signed forms will remain at school.

Questions? Contact {teacher} at ext. {random.randint(100, 499)}.

---
PERMISSION SLIP — {dest} — {trip_date}

I give permission for my child _______________ to attend this field trip.

Parent Signature: _______________  Date: _______________"""

    analysis = {
        "doc_type": "field_trip_permission",
        "urgency": "high",
        "deadline": deadline,
        "summary": f"Your child's {grade} class is going on a field trip to the {dest} on {trip_date}. You need to sign a permission slip and pay {fee} by {deadline}. Pack a bag lunch and comfortable shoes for the trip day.",
        "required_actions": [
            {"action": "Sign and return the permission slip", "deadline": deadline},
            {"action": f"Pay {fee} field trip fee (cash or check)", "deadline": deadline},
            {"action": "Pack a bag lunch for your child", "deadline": trip_date},
        ],
        "items_needed": ["signed permission slip", f"{fee} cash or check", "bag lunch", "comfortable walking shoes"],
        "reply_needed": True,
        "reply_draft": f"Dear {teacher},\n\nI give permission for my child to attend the {dest} field trip on {trip_date}. The signed slip and {fee} are enclosed.\n\nThank you,\n[Parent Name]",
        "evidence": [
            {"claim": f"Trip to {dest} on {trip_date}", "source_quote": f"{grade} students at {school} will be visiting the {dest} on {trip_date}"},
            {"claim": f"Permission slip due {deadline}", "source_quote": f"Return the signed permission slip by {deadline}"},
            {"claim": f"{fee} fee required", "source_quote": f"A fee of {fee} covers admission and transportation"},
        ],
        "confidence": round(random.uniform(0.88, 0.97), 2),
    }

    return notice, analysis


def generate_immunization():
    school = random.choice(SCHOOL_NAMES)
    deadline = random_date(30, 90)

    notice = f"""IMPORTANT: Immunization Requirements for {school}

Dear Families,

All students must have current immunization records on file by {deadline}.

Required immunizations:
- DTaP: 5 doses
- Polio (IPV): 4 doses
- MMR: 2 doses
- Varicella: 2 doses
- Hepatitis B: 3 doses

Students without complete records will not be permitted to attend classes.

Free clinics available at Oak Street Community Health Center (555-{random.randint(1000, 9999)}) every Tuesday and Thursday, 9 AM - 4 PM.

Submit records to the school nurse's office, Room {random.randint(100, 300)}.

Sincerely,
Nurse {random.choice(['Williams', 'Davis', 'Brown', 'Wilson', 'Taylor'])}"""

    analysis = {
        "doc_type": "immunization_reminder",
        "urgency": "high",
        "deadline": deadline,
        "summary": f"Your child needs updated vaccination records before {deadline}. Without complete records, your child cannot attend class. Free vaccines are available at the Oak Street Community Health Center on Tuesdays and Thursdays.",
        "required_actions": [
            {"action": "Schedule vaccination appointment if records are not current", "deadline": None},
            {"action": "Submit updated immunization record to school nurse", "deadline": deadline},
        ],
        "items_needed": ["updated immunization record from doctor"],
        "reply_needed": False,
        "reply_draft": None,
        "evidence": [
            {"claim": f"Records due by {deadline}", "source_quote": f"All students must have current immunization records on file by {deadline}"},
            {"claim": "Cannot attend without records", "source_quote": "Students without complete records will not be permitted to attend classes"},
        ],
        "confidence": round(random.uniform(0.90, 0.97), 2),
    }

    return notice, analysis


def generate_fee_notice():
    school = random.choice(SCHOOL_NAMES)
    fee_type = random.choice(["school supplies", "activity fee", "technology fee", "yearbook", "class photos"])
    amount = random_fee()
    deadline = random_date(14, 45)

    notice = f"""{school} — {fee_type.title()} Payment Notice

Dear Parent/Guardian,

This is a reminder that the {fee_type} payment of {amount} is due by {deadline}.

Payment methods accepted:
- Cash or check (payable to {school})
- Online at {school.lower().replace(' ', '')}.edu/payments

If you need financial assistance, fee waiver applications are available in the main office. Free and reduced lunch recipients may qualify for automatic fee waivers.

Late payments may result in your child being unable to participate in related activities.

Please contact the office at 555-{random.randint(1000, 9999)} with questions.

Thank you,
{school} Administration"""

    analysis = {
        "doc_type": "fee_notice",
        "urgency": "high",
        "deadline": deadline,
        "summary": f"Your child's school is requesting a {amount} payment for {fee_type} by {deadline}. You can pay by cash, check, or online. If you need help paying, ask the school office about fee waivers — families who get free or reduced lunch may qualify automatically.",
        "required_actions": [
            {"action": f"Pay {amount} for {fee_type}", "deadline": deadline},
        ],
        "items_needed": [f"{amount} cash or check, or online payment"],
        "reply_needed": False,
        "reply_draft": None,
        "evidence": [
            {"claim": f"{amount} payment due {deadline}", "source_quote": f"the {fee_type} payment of {amount} is due by {deadline}"},
            {"claim": "Fee waivers available", "source_quote": "fee waiver applications are available in the main office"},
        ],
        "confidence": round(random.uniform(0.88, 0.96), 2),
    }

    return notice, analysis


def generate_event_announcement():
    school = random.choice(SCHOOL_NAMES)
    event = random.choice([
        ("Science Fair", "gymnasium"),
        ("Spring Concert", "auditorium"),
        ("Open House", "classrooms"),
        ("Book Fair", "library"),
        ("Sports Day", "athletic field"),
        ("Art Show", "cafeteria"),
    ])
    event_name, location = event
    event_date = random_date(7, 45)
    time = f"{random.randint(5, 7)}:{random.choice(['00', '30'])} PM"

    notice = f"""{school} — {event_name} Invitation

Dear Families,

You are invited to our annual {event_name}!

Date: {event_date}
Time: {time}
Location: {school} {location}

All family members are welcome. Light refreshments will be served.

{random.choice([
    'Student projects will be on display throughout the evening.',
    'Students have been preparing for weeks and are excited to share their work.',
    'This is a wonderful opportunity to see what your child has been learning.',
])}

No RSVP required. Parking is available in the main lot.

We look forward to seeing you there!

{random.choice(TEACHER_NAMES)}
Event Coordinator"""

    analysis = {
        "doc_type": "event_announcement",
        "urgency": "low",
        "deadline": None,
        "summary": f"Your child's school is hosting a {event_name} on {event_date} at {time} in the {location}. All family members are welcome. No RSVP or payment needed — just come and enjoy!",
        "required_actions": [],
        "items_needed": [],
        "reply_needed": False,
        "reply_draft": None,
        "evidence": [
            {"claim": f"{event_name} on {event_date}", "source_quote": f"You are invited to our annual {event_name}!"},
            {"claim": f"At {time} in {location}", "source_quote": f"Time: {time}"},
        ],
        "confidence": round(random.uniform(0.92, 0.98), 2),
    }

    return notice, analysis


def generate_schedule_change():
    school = random.choice(SCHOOL_NAMES)
    change_type = random.choice([
        ("early dismissal", "1:00 PM", "teacher professional development"),
        ("two-hour delay", "10:00 AM start", "weather conditions"),
        ("half day", "12:00 PM dismissal", "parent-teacher conferences"),
    ])
    change, time_detail, reason = change_type
    date = random_date(3, 30)

    notice = f"""{school} Schedule Change Notice

Dear Families,

Please be advised of the following schedule change:

Date: {date}
Change: {change.title()} — {time_detail}
Reason: {reason.title()}

{random.choice([
    'Please arrange for your child to be picked up or have supervision at the adjusted time.',
    'Bus schedules will be adjusted accordingly.',
    'After-school programs will not be available on this date.',
])}

If you have questions about transportation, contact the office.

{school} Administration"""

    analysis = {
        "doc_type": "schedule_change",
        "urgency": "medium",
        "deadline": date,
        "summary": f"On {date}, {school} will have a {change} ({time_detail}) due to {reason}. Make sure your child has a way to get home at the adjusted time.",
        "required_actions": [
            {"action": f"Arrange pickup or supervision for {change} at {time_detail}", "deadline": date},
        ],
        "items_needed": [],
        "reply_needed": False,
        "reply_draft": None,
        "evidence": [
            {"claim": f"{change.title()} on {date}", "source_quote": f"Date: {date}"},
            {"claim": time_detail, "source_quote": f"Change: {change.title()} — {time_detail}"},
        ],
        "confidence": round(random.uniform(0.90, 0.97), 2),
    }

    return notice, analysis


def generate_attendance_warning():
    school = random.choice(SCHOOL_NAMES)
    absences = random.randint(5, 12)
    threshold = random.choice([5, 7, 10])

    notice = f"""Attendance Concern — {school}

Dear Parent/Guardian,

Our records indicate your child has accumulated {absences} absences this semester, which exceeds our threshold of {threshold} absences.

Regular attendance is essential for academic success. State law requires schools to report excessive absences.

We would like to schedule a meeting to discuss your child's attendance and develop a plan for improvement.

Please contact the attendance office at 555-{random.randint(1000, 9999)} or reply to this notice within 5 business days.

{random.choice([
    'If absences are due to medical reasons, please provide documentation from your healthcare provider.',
    'An attendance improvement plan may help prevent further action.',
    'We are here to support your family and find solutions together.',
])}

Sincerely,
{random.choice(TEACHER_NAMES)}
Attendance Coordinator"""

    analysis = {
        "doc_type": "attendance_warning",
        "urgency": "high",
        "deadline": None,
        "summary": f"The school is concerned because your child has {absences} absences this semester, which is more than the {threshold}-absence limit. They want to meet with you to make a plan. Please call or reply within 5 business days. If absences are due to illness, bring a doctor's note.",
        "required_actions": [
            {"action": "Contact the attendance office within 5 business days", "deadline": None},
            {"action": "Schedule a meeting to discuss attendance plan", "deadline": None},
            {"action": "Gather medical documentation if absences are health-related", "deadline": None},
        ],
        "items_needed": ["medical documentation if applicable"],
        "reply_needed": True,
        "reply_draft": f"Dear Attendance Office,\n\nThank you for reaching out about my child's attendance. I would like to schedule a meeting to discuss this. Please let me know available times.\n\nSincerely,\n[Parent Name]",
        "evidence": [
            {"claim": f"{absences} absences recorded", "source_quote": f"your child has accumulated {absences} absences this semester"},
            {"claim": f"Exceeds {threshold}-absence threshold", "source_quote": f"exceeds our threshold of {threshold} absences"},
        ],
        "confidence": round(random.uniform(0.88, 0.95), 2),
    }

    return notice, analysis


def generate_meeting_invitation():
    school = random.choice(SCHOOL_NAMES)
    teacher = random.choice(TEACHER_NAMES)
    meeting_type = random.choice(["parent-teacher conference", "IEP meeting", "504 plan review"])
    date = random_date(5, 21)
    time = f"{random.randint(2, 5)}:{random.choice(['00', '15', '30'])} PM"

    notice = f"""{meeting_type.title()} Scheduling — {school}

Dear Parent/Guardian,

You are invited to a {meeting_type} with {teacher}.

Proposed date: {date}
Proposed time: {time}
Location: {school}, Room {random.randint(100, 400)}

{random.choice([
    f'We will discuss your child\'s academic progress and goals for the remainder of the year.',
    f'This meeting will review your child\'s current plan and any needed adjustments.',
    f'Please come prepared with any questions or concerns about your child\'s education.',
])}

If this time does not work, please contact us to reschedule.

Translation services are available upon request — please let us know at least 48 hours in advance.

Thank you,
{teacher}"""

    analysis = {
        "doc_type": "meeting_invitation",
        "urgency": "medium",
        "deadline": date,
        "summary": f"{teacher} would like to meet with you for a {meeting_type} on {date} at {time}. If you can't make that time, call to reschedule. Translation help is available if you ask 48 hours ahead.",
        "required_actions": [
            {"action": f"Confirm or reschedule the {meeting_type}", "deadline": date},
            {"action": "Request translation services if needed (48 hours advance notice)", "deadline": None},
        ],
        "items_needed": [],
        "reply_needed": True,
        "reply_draft": f"Dear {teacher},\n\nThank you for scheduling the {meeting_type}. I confirm I can attend on {date} at {time}.\n\nSincerely,\n[Parent Name]",
        "evidence": [
            {"claim": f"{meeting_type} on {date} at {time}", "source_quote": f"Proposed date: {date}"},
            {"claim": "Translation available", "source_quote": "Translation services are available upon request"},
        ],
        "confidence": round(random.uniform(0.90, 0.97), 2),
    }

    return notice, analysis


def generate_fundraising():
    school = random.choice(SCHOOL_NAMES)
    fundraiser = random.choice([
        ("wrapping paper sale", "wrapping paper and gift bags"),
        ("bake sale", "baked goods"),
        ("read-a-thon", "reading pledges"),
        ("fun run", "lap pledges"),
        ("box tops collection", "box tops"),
    ])
    name, item = fundraiser
    deadline = random_date(14, 45)

    notice = f"""{school} {name.title()} Fundraiser

Dear Families,

Our annual {name} is here! Proceeds support {random.choice([
    'new playground equipment',
    'classroom technology upgrades',
    'field trip subsidies',
    'library book purchases',
    'after-school enrichment programs',
])}.

How to participate:
- Order forms / pledge sheets are attached
- Return completed forms by {deadline}
- {random.choice(['Online ordering is also available at the link below.', 'All items will be delivered to school.'])}

Participation is completely voluntary. Every contribution, big or small, makes a difference!

Questions? Contact the PTA at pta@{school.lower().replace(' ', '')}.edu.

Thank you for your support!
{school} PTA"""

    analysis = {
        "doc_type": "fundraising",
        "urgency": "low",
        "deadline": deadline,
        "summary": f"The school is running a {name} fundraiser. Participation is completely voluntary — there is no obligation to participate. If you'd like to help, return the order form by {deadline}.",
        "required_actions": [
            {"action": f"Return order/pledge form if participating", "deadline": deadline},
        ],
        "items_needed": ["completed order/pledge form (if participating)"],
        "reply_needed": False,
        "reply_draft": None,
        "evidence": [
            {"claim": "Participation is voluntary", "source_quote": "Participation is completely voluntary"},
            {"claim": f"Forms due {deadline}", "source_quote": f"Return completed forms by {deadline}"},
        ],
        "confidence": round(random.uniform(0.90, 0.97), 2),
    }

    return notice, analysis


GENERATORS = [
    (generate_field_trip, 100),
    (generate_immunization, 80),
    (generate_fee_notice, 80),
    (generate_event_announcement, 70),
    (generate_schedule_change, 60),
    (generate_attendance_warning, 60),
    (generate_meeting_invitation, 60),
    (generate_fundraising, 50),
]


def make_conversation(notice_text: str, analysis: dict, lang_code: str = "en") -> dict:
    lang_name = LANGUAGES[lang_code]
    return {
        "conversations": [
            {"role": "system", "content": SYSTEM_PROMPT},
            {
                "role": "user",
                "content": f"Analyze this school notice:\n\n{notice_text}\n\nTarget language: {lang_name}",
            },
            {
                "role": "assistant",
                "content": json.dumps(analysis, ensure_ascii=False),
            },
        ]
    }


def main():
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    examples = []

    for gen_fn, count in GENERATORS:
        for _ in range(count):
            notice, analysis = gen_fn()
            lang = random.choice(list(LANGUAGES.keys()))
            examples.append(make_conversation(notice, analysis, lang))

    random.shuffle(examples)

    split = int(len(examples) * 0.9)
    train = examples[:split]
    val = examples[split:]

    with open(OUTPUT_DIR / "train.jsonl", "w", encoding="utf-8") as f:
        for ex in train:
            f.write(json.dumps(ex, ensure_ascii=False) + "\n")

    with open(OUTPUT_DIR / "val.jsonl", "w", encoding="utf-8") as f:
        for ex in val:
            f.write(json.dumps(ex, ensure_ascii=False) + "\n")

    print(f"Generated {len(train)} training examples and {len(val)} validation examples")
    print(f"Output: {OUTPUT_DIR / 'train.jsonl'} and {OUTPUT_DIR / 'val.jsonl'}")


if __name__ == "__main__":
    main()
