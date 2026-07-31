const transporter = require("../config/email");

exports.envoyerMessage = async (req, res) => {
    try {
        const { nom, email, sujet, message } = req.body;

        if (!nom || !email || !sujet || !message) {
            return res.status(400).json({
                message: "Tous les champs sont obligatoires."
            });
        }

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_USER,
            replyTo: email,
            subject: `📩 ${sujet}`,
            html: `
                <h2>Nouveau message de contact</h2>

                <p><strong>Nom :</strong> ${nom}</p>

                <p><strong>Email :</strong> ${email}</p>

                <p><strong>Sujet :</strong> ${sujet}</p>

                <hr>

                <p>${message}</p>
            `
        };

        await transporter.sendMail(mailOptions);

        res.status(200).json({
            message: "Votre message a été envoyé avec succès."
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Erreur lors de l'envoi de l'email."
        });
    }
};