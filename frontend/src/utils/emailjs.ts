export async function sendEmailJS(toName: string, toEmail: string, subject: string, message: string) {
    const serviceId = "service_qhi38c2";
    const templateId = "template_goozcmn";
    const publicKey = "loow2YPEiKxZ_qIR-";

    const payload = {
        service_id: serviceId,
        template_id: templateId,
        user_id: publicKey,
        template_params: {
            to_name: toName,
            to_email: toEmail,
            subject: subject,
            message: message,
        },
    };

    try {
        const response = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            console.error("EmailJS error:", await response.text());
            return false;
        }
        return true;
    } catch (e) {
        console.error("EmailJS request failed:", e);
        return false;
    }
}
