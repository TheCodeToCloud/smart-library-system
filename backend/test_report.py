import datetime, csv
from django.utils import timezone
from io import StringIO
from django.core.files.base import ContentFile
from reports.models import Report
from accounts.models import User

try:
    report = Report(name='test', report_type='Members', generated_by=User.objects.first())
    csv_buffer = StringIO()
    writer = csv.writer(csv_buffer)
    writer.writerow(['A'])
    filename = f'Members_{timezone.now().strftime("%Y%m%d%H%M%S")}.csv'
    csv_file = ContentFile(csv_buffer.getvalue().encode('utf-8'))
    report.file.save(filename, csv_file, save=True)
    print("SUCCESS")
except Exception as e:
    import traceback
    traceback.print_exc()
