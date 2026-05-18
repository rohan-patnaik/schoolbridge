"""Generate realistic school notice samples for demo recording."""
from fpdf import FPDF
from PIL import Image, ImageDraw, ImageFont
import os

OUT = os.path.dirname(__file__)


def make_permission_slip_pdf():
    """A realistic permission slip PDF that looks like a scanned school document."""
    pdf = FPDF()
    pdf.add_page()
    pdf.set_auto_page_break(auto=True, margin=15)

    # Header
    pdf.set_font("Helvetica", "B", 16)
    pdf.cell(0, 10, "MAPLE GROVE ELEMENTARY", ln=True, align="C")
    pdf.set_font("Helvetica", "", 10)
    pdf.cell(0, 5, "4521 Riverside Drive, Portland, OR 97201", ln=True, align="C")
    pdf.cell(0, 5, "Phone: (503) 555-0178  |  Fax: (503) 555-0179", ln=True, align="C")
    pdf.ln(8)

    # Line separator
    pdf.set_draw_color(0)
    pdf.line(10, pdf.get_y(), 200, pdf.get_y())
    pdf.ln(8)

    # Title
    pdf.set_font("Helvetica", "B", 14)
    pdf.cell(0, 8, "FIELD TRIP PERMISSION FORM", ln=True, align="C")
    pdf.set_font("Helvetica", "B", 12)
    pdf.cell(0, 7, "Oregon Museum of Science and Industry (OMSI)", ln=True, align="C")
    pdf.ln(6)

    # Date
    pdf.set_font("Helvetica", "", 11)
    pdf.cell(0, 6, "Date: February 10, 2025", ln=True)
    pdf.ln(3)

    # Body
    pdf.set_font("Helvetica", "", 11)
    body = (
        "Dear Parents and Guardians,\n\n"
        "The 3rd grade classes will be taking a field trip to the Oregon Museum of Science "
        "and Industry (OMSI) on Friday, March 14, 2025. We will depart from school at "
        "8:15 AM by charter bus and return by 3:00 PM.\n\n"
        "The cost of the trip is $18.00 per student, which covers museum admission, the "
        "planetarium show, and bus transportation. Payment must be received by Friday, "
        "March 7, 2025. Checks should be made payable to 'Maple Grove PTA'. Cash is "
        "also accepted in a sealed envelope labeled with your child's name and teacher.\n\n"
        "WHAT YOUR CHILD NEEDS:\n"
        "  - Packed lunch and water bottle (NO nut products due to allergies)\n"
        "  - Comfortable walking shoes\n"
        "  - Weather-appropriate jacket (we will be walking outside between buildings)\n"
        "  - NO electronic devices or spending money\n\n"
        "Students who do not return a signed permission form will remain at school with "
        "supervised activities. If the cost presents a hardship, please contact Mrs. Davis "
        "confidentially at ext. 215 - scholarship funds are available.\n\n"
        "We also need 4 parent chaperones. If you are available and have a current background "
        "check on file, please indicate below.\n\n"
        "Questions? Contact your child's teacher or the front office at (503) 555-0178.\n\n"
        "Thank you!\n"
        "Mrs. Sarah Mitchell\n"
        "3rd Grade Team Lead"
    )
    pdf.multi_cell(0, 6, body)
    pdf.ln(6)

    # Cut line
    pdf.set_draw_color(150)
    pdf.dashed_line(10, pdf.get_y(), 200, pdf.get_y(), 3, 2)
    pdf.ln(5)

    # Permission slip section
    pdf.set_font("Helvetica", "B", 11)
    pdf.cell(0, 7, "PERMISSION SLIP - OMSI Field Trip - March 14, 2025", ln=True, align="C")
    pdf.cell(0, 7, "Please return by: March 7, 2025", ln=True, align="C")
    pdf.ln(5)

    pdf.set_font("Helvetica", "", 11)
    pdf.cell(0, 8, "Student Name: _________________________________   Grade/Teacher: ______________", ln=True)
    pdf.ln(3)
    pdf.cell(0, 8, "( ) YES, my child has permission to attend the OMSI field trip.", ln=True)
    pdf.cell(0, 8, "( ) NO, my child will NOT attend. Please provide alternative activities.", ln=True)
    pdf.ln(3)
    pdf.cell(0, 8, "( ) I would like to volunteer as a chaperone (background check required).", ln=True)
    pdf.ln(3)
    pdf.cell(0, 8, "Payment enclosed: $18.00   ( ) Cash   ( ) Check #________", ln=True)
    pdf.ln(5)
    pdf.cell(0, 8, "Emergency Contact: ___________________________  Phone: ____________________", ln=True)
    pdf.ln(3)
    pdf.cell(0, 8, "Allergies/Medical Conditions: ________________________________________________", ln=True)
    pdf.ln(5)
    pdf.cell(0, 8, "Parent/Guardian Signature: ________________________  Date: ___________________", ln=True)

    out_path = os.path.join(OUT, "permission-slip-omsi.pdf")
    pdf.output(out_path)
    print(f"Created: {out_path}")


def make_fee_notice_image():
    """A notice that looks like a photo of a printed letter (slightly imperfect)."""
    W, H = 850, 1100
    img = Image.new("RGB", (W, H), (252, 250, 245))
    draw = ImageDraw.Draw(img)

    # Simulate paper texture with subtle noise
    import random
    for _ in range(2000):
        x, y = random.randint(0, W-1), random.randint(0, H-1)
        gray = random.randint(245, 255)
        draw.point((x, y), fill=(gray, gray, gray))

    try:
        font_title = ImageFont.truetype("arial.ttf", 28)
        font_bold = ImageFont.truetype("arialbd.ttf", 20)
        font_body = ImageFont.truetype("arial.ttf", 18)
        font_small = ImageFont.truetype("arial.ttf", 14)
    except OSError:
        font_title = ImageFont.load_default()
        font_bold = font_title
        font_body = font_title
        font_small = font_title

    y = 50
    # School header
    draw.text((W//2, y), "WASHINGTON MIDDLE SCHOOL", fill=(30, 30, 30), font=font_title, anchor="mt")
    y += 40
    draw.text((W//2, y), "Student Accounts Office", fill=(80, 80, 80), font=font_body, anchor="mt")
    y += 30
    draw.text((W//2, y), "2900 Madison Blvd, Austin, TX 78702", fill=(80, 80, 80), font=font_small, anchor="mt")
    y += 30

    # Line
    draw.line([(60, y), (W-60, y)], fill=(150, 150, 150), width=2)
    y += 25

    # Title
    draw.text((W//2, y), "OUTSTANDING FEE NOTICE", fill=(180, 40, 40), font=font_bold, anchor="mt")
    y += 35

    draw.text((60, y), "Date: April 2, 2025", fill=(30, 30, 30), font=font_body)
    y += 30
    draw.text((60, y), "Student: ____________________", fill=(30, 30, 30), font=font_body)
    y += 30
    draw.text((60, y), "Grade: 7th", fill=(30, 30, 30), font=font_body)
    y += 40

    lines = [
        "Dear Parent/Guardian,",
        "",
        "Our records show an outstanding balance of $45.00 on your",
        "child's account. This includes:",
        "",
        "   - Science lab materials fee: $25.00 (due Feb 1)",
        "   - Technology fee: $20.00 (due Jan 15)",
        "",
        "Please remit payment by April 15, 2025 to avoid your child",
        "being excluded from the 8th grade field trip and end-of-year",
        "activities.",
        "",
        "Payment methods accepted:",
        "   1. Online at payments.washingtonms.edu",
        "   2. Check payable to 'Washington MS' sent to front office",
        "   3. Cash in person at the Student Accounts window (Rm 104)",
        "",
        "If you believe this balance is in error or if you need to",
        "arrange a payment plan, please contact the Student Accounts",
        "office at (512) 555-0234 ext. 104 by April 10, 2025.",
        "",
        "Financial assistance is available for qualifying families.",
        "Contact Mrs. Torres at ext. 108 for a confidential",
        "consultation.",
        "",
        "Sincerely,",
        "James Porter",
        "Student Accounts Coordinator",
    ]

    for line in lines:
        draw.text((60, y), line, fill=(30, 30, 30), font=font_body)
        y += 26

    out_path = os.path.join(OUT, "fee-notice-photo.png")
    img.save(out_path, quality=92)
    print(f"Created: {out_path}")


def make_schedule_change_txt():
    """An event/schedule change notice as plain text."""
    text = """IMPORTANT SCHEDULE CHANGE — EARLY DISMISSAL

Riverside Academy
345 Elm Street, Chicago, IL 60614

April 8, 2025

Dear Families,

Due to a district-wide professional development day, ALL STUDENTS will be dismissed early on Wednesday, April 16, 2025.

REVISED SCHEDULE:
- Grades K-2: Dismissal at 12:00 PM (regular: 3:15 PM)
- Grades 3-5: Dismissal at 12:30 PM (regular: 3:30 PM)
- After-school programs and clubs are CANCELLED for this day
- Bus transportation will run on the early dismissal schedule

IMPORTANT:
If your child normally rides the bus, they will be picked up at their regular stop but approximately 3 hours earlier than normal. Please make arrangements for supervision.

If your child is a car rider or walker, please ensure someone is available to receive them at the earlier time.

The Extended Day Program (EDP) WILL operate from dismissal until 6:00 PM for enrolled families only. Drop-in care is not available on early dismissal days.

Lunch will be served before dismissal. Students do NOT need to bring a lunch.

If you need to make alternate arrangements for your child, please send a signed note to the front office or email attendance@riverside.cps.edu by Monday, April 14.

Thank you for your understanding.

Dr. Maria Gonzalez
Principal, Riverside Academy
mgonzalez@riverside.cps.edu
(312) 555-0199
"""
    out_path = os.path.join(OUT, "schedule-change-early-dismissal.txt")
    with open(out_path, "w") as f:
        f.write(text)
    print(f"Created: {out_path}")


if __name__ == "__main__":
    make_permission_slip_pdf()
    make_fee_notice_image()
    make_schedule_change_txt()
    print("\nAll demo samples created!")
