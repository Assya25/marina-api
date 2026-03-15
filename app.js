require("dotenv").config();

const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const User = require("./models/User");
const Catway = require("./models/Catway");
const Reservations = require("./models/Reservations");
const { error } = require("console");

const app = express();
const PORT = process.env.PORT || 3000;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));


 app.use(express.urlencoded({extended: true}));
 app.use(express.json());


mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connecté");

    app.get("/", (req, res) => {
      res.render("pages/home", { title: "Accueil" });
    });

    app.get("/create-user", async (req, res) => {
      try {
        const user = new User({
          username: "Lily",
          email: "lily@test.com",
          password: "123456",
        });

        await user.save();
        res.send("Utilisateur créé avec succès");
      } catch (error) {
        console.error(error);
        res.send("Erreur lors de la création de l'utilisateur");
      }
    });

    /**
 * Récupère la liste de tous les utilisateurs.
 * @route GET /users
 * @returns {Array}
 */
    app.get("/users", async (req, res) => {
      try {
        const users = await User.find();
        res.json(users);
      } catch (error) {
        console.error(error);
        res.send("Erreur lors de la récupération des utilisateurs");
      }
    });

    /**
 * Récupère la liste de tous les catways.
 * @route GET /catways
 * @returns {Array}
 */
    app.get("/catways", async (req, res) => {
      try {
        const catways = await Catway.find();
        res.json(catways);
      } catch (error) {
        console.error(error);
        res.send("Erreur lors de la récupération des catways");
      }
    });

    /**
 * Récupère la liste de toutes les réservations.
 * @route GET /reservations
 * @returns {Array}
 */
     app.get("/reservations", async (req, res) => {
        try {
            const reservations = await Reservations.find();
            res.json(reservations);
        } catch (error) {
            console.error(error);
            res.send("Erreur lors de la récupération des réservations")
        }
     });

     /**
/**
 * Récupère un catway à partir de son numéro.
 * @route GET /catways/:id
 * @param {number} req.params.id
 * @returns {Object}
 */
     app.get("/catways/:id/reservations", async (req, res) => {
        try {
            const catwayNumber = Number(req.params.id);
            const reservations = await Reservations.find({catwayNumber: catwayNumber});
            res.json(reservations);
        } catch (error) {
            console.error(error);
            res.send("Erreur lors de la récupération des réservations du catway")
        }
     });

     app.get("/catways/:id", async (req, res) => {
        try {
            const catwayNumber = Number(req.params.id);
            const catway = await Catway.findOne({ catwayNumber: catwayNumber});

            if (!catway) {
                return res.status(404).send("Catway introuvable");
            }

            res.json(catway);
        } catch (error) {
            console.error(error);
            res.send("Erreur lors de la récupération du catway");
        }
    });

    /**
 * Récupère une réservation précise d'un catway.
 * @route GET /catways/:id/reservations/:idReservation
 * @param {number} req.params.id
 * @param {string} req.params.idReservation
 * @returns {Object}
 */
    app.get("/catways/:id/reservations/:idReservation", async (req, res) => {
    try {
        const catwayNumber = Number(req.params.id);
        const reservationId = req.params.idReservation;

        const reservation = await Reservation.findOne({
            _id: reservationId, 
            catwayNumber: catwayNumber,
         });

         if (!reservation) {
            return res.status(404).send("Reservation introuvable");
         }

         res.json(reservation);
    } catch (error) {
        console.error(error);
        res.send("Erreur lors de la récupération de la réservation");
    }
  });

  /**
 * Crée un nouveau catway.
 * @route POST /catways
 * @param {number} req.body.catwayNumber
 * @param {string} req.body.catwayType
 * @param {string} req.body.catwayState
 * @returns {Object}
 */
  app.post("/catways", async (req, res ) => {
    try {
        const newCatway = new Catway({
            catwayNumber: req.body.catwayNumber,
            catwayType: req.body.catwayType, 
            catwayState: req.body.catwayState,
        });

        await newCatway.save();
        res.json(newCatway);
        } catch (error) {
            console.error(error);
            res.status(500).send("Erreur lors de la création du catway");
        } 
  });

  app.get ("/test-create-catway", async (req, res) => {
    try {
        const newCatway = new Catway ({
            catwayNumber : 999,
            catwayType: "long",
            catwayState: "Disponible",
        });

        await newCatway.save();
        res.send("Catway créé avec succès");
    } catch (error) {
        console.error(error);
        res.send("Erreur lors de la création du catway");
    }
});

/**
 * Met à jour un catway à partir de son numéro.
 * @route PUT /catways/:id
 * @param {number} req.params.id
 * @returns {Object}
 */
app.put("/catway/:id", async (req, res) => {
    try {
        const catwayNumber = await Catway.findOneAndUpdate(
            { catwayNumber: catwayNumber},
            {
                catwayType: req.body.catwayType,
                catwayState: req.body.catwayState,
            },
            {new: true}
    
        );
    
    if (!updateCatway) {
        return res.status(404).send("Catway introuvable")
    }
    
    res.json(updatedCatway);
    } catch (error) {
        console.error(error);
        res.status(500).send("Erreur lors de la mise à jour du catway");
    }
});

app.get("/test-update-catway", async (req, res) => {
    try {
        const updatedCatway = await Catway.findOneAndUpdate(
            {catwayNumber: 999},
            {
                catwayType:"short",
                catwayState:"En maintenance",
            },
            { new: true}
        );

        if (!updatedCatway) {
            return res.send("Catway 999 introuvable");
        }

        res.send("Catway mis à jour avec succès");
        } catch (error) {
        console.error(error);
        res.send("Erreur lors de la mise à jour du catway");
    }

  });

/**
 * Supprime un catway à partir de son numéro.
 * @route DELETE /catways/:id
 * @param {number} req.params.id
 * @returns {string}
 */
app.delete("/catways/:id", async (req, res) => {
try {
    const catwayNumber = Number(req.params.id);

    const deletedCatway = await Catway.findOneAndDelete({
        catwayNumber: catwayNumber,
    });

    if (!deletedCatway) {
        return res.status(404).send("Catway introuvable");
    }

    res.send("Catway supprimé avec succès");
} catch (error) {
    console.error(error);
    res.status(500).send("Erreur lors de la suppression du catway");
}
});

app.get("/test-delete-catway", async (req, res) => {
    try {
        const deletedCatway = await Catway.findOneAndDelete({
            catwayNumber:999, 
        });

        if (!deletedCatway) {
            return res.send("Catway 999 introuvable");   
        }

        res.send("Catway supprimé avec succès");
    } catch (error) {
        console.error(error);
        res.send("Erreur lors de la suppression du catway");
    }
  });

  app.put("/catways/:id", async (req, res) => {
  try {
    const catwayNumber = Number(req.params.id);

    const updatedCatway = await Catway.findOneAndUpdate(
      { catwayNumber: catwayNumber },
      {
        catwayType: req.body.catwayType,
        catwayState: req.body.catwayState,
      },
      { new: true }
    );

    if (!updatedCatway) {
      return res.status(404).send("Catway introuvable");
    }

    res.json(updatedCatway);
  } catch (error) {
    console.error(error);
    res.status(500).send("Erreur lors de la mise à jour du catway");
  }
});

app.get("/test-create-reservation", async (req, res) => {
    try {
        const newReservation = new Reservation({
            catwayNumber: 1, 
            clientName : "Lily Test",
            boatName: "Blue Moon",
            startDate: new Date("2026-03-20"),
            endDate: new Date("2026-03-25"),
        });

        await newReservation.save();
        res.send("Réservation créée avec succès");
    } catch (error) {
        console.error(error);
        res.send("Erreur lors de la création de la réservation")
    }
    });

   app.put("/catways/:id", async (req, res) => {
  try {
    const catwayNumber = Number(req.params.id);

    const updatedCatway = await Catway.findOneAndUpdate(
      { catwayNumber: catwayNumber },
      {
        catwayType: req.body.catwayType,
        catwayState: req.body.catwayState,
      },
      { new: true }
    );

    if (!updatedCatway) {
      return res.status(404).send("Catway introuvable");
    }

    res.json(updatedCatway);
  } catch (error) {
    console.error(error);
    res.status(500).send("Erreur lors de la mise à jour du catway");
  }
});

app.get("/test-update-reservation", async (req, res) => {
  try {
    const reservation = await Reservation.findOne({ catwayNumber: 1 });

    if (!reservation) {
      return res.send("Aucune réservation trouvée pour le catway 1");
    }

    reservation.clientName = "Lily Updated";
    reservation.boatName = "Red Moon";
    reservation.startDate = new Date("2026-04-01");
    reservation.endDate = new Date("2026-04-10");

    await reservation.save();
    res.send("Réservation mise à jour avec succès");
  } catch (error) {
    console.error(error);
    res.send("Erreur lors de la mise à jour de la réservation");
  }
});
 
app.delete ("/catways/:id/reservations/:idReservation", async (req, res) => {
try {
    const catwayNumber = Number(req.params.id);
    const reservationId = req.params.idReservation;

    const deletedReservation = await Reservation.findOneAndDelete({
        _id: reservationId,
        catwayNumber: catwayNumber,
    });

    if(!deletedReservation) {
        return res.status(404).send("Réservation introuvable");
    }

    res.send("Réservation supprimé avec succès");
    } catch (error) {
        console.error(error);
        res.status(500).send("Erreur lors de la suppression de la réservation");
    }
        });

       app.get("/test-delete-reservation", async (req, res) => {
  try {
    console.log("Route test-delete-reservation appelée");

    const reservation = await Reservation.findOne({ catwayNumber: 1 });

    if (!reservation) {
      return res.send("Aucune réservation à supprimer pour le catway 1");
    }

    await Reservation.findByIdAndDelete(reservation._id);

    return res.send("Réservation supprimée avec succès");
  } catch (error) {
    console.error("Erreur test-delete-reservation :", error);
    return res.send("Erreur lors de la suppression de la réservation");
  }
});

/**
 * Récupère un utilisateur à partir de son email.
 * @route GET /users/:email
 * @param {string} req.params.email
 * @returns {Object}
 */
app.get("/users/:email", async (req, res) => {
  try {
    const email = req.params.email;
    const user = await User.findOne({ email: email });

    if (!user) {
      return res.status(404).send("Utilisateur introuvable");
    }

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).send("Erreur lors de la récupération de l'utilisateur");
  }
});

/**
 * Crée un nouvel utilisateur.
 * @route POST /users
 * @param {string} req.body.username
 * @param {string} req.body.email
 * @param {string} req.body.password
 * @returns {Object}
 */
app.post("/users", async (req, res) => {
  try {
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
    });

    await newUser.save();
    res.json(newUser);
  } catch (error) {
    console.error(error);
    res.status(500).send("Erreur lors de la création de l'utilisateur");
  }
});

app.get("/test-create-user", async (req, res) => {
  try {
    const newUser = new User({
      username: "TestUser",
      email: "testuser@test.com",
      password: "123456",
    });
    
    await newUser.save();
    res.send("Utilisateur créé avec succès");
  } catch (error) {
    console.error(error);
    res.send("Erreur lors de la création de l'utilisateur");
  }
});

app.get("/test-update-user", async (req, res) => {
  try {
    const updatedUser = await User.findOneAndUpdate(
      { email: "testuser@test.com" },
      {
        username: "TestUserUpdated",
        password: "abcdef",
      },
      { new: true }
    );

    if (!updatedUser) {
      return res.send("Utilisateur test introuvable");
    }

    res.send("Utilisateur mis à jour avec succès");
  } catch (error) {
    console.error(error);
    res.send("Erreur lors de la mise à jour de l'utilisateur");
  }
});

/**
 * Supprime un utilisateur à partir de son email.
 * @route DELETE /users/:email
 * @param {string} req.params.email
 * @returns {string}
 */
app.delete("/users/:email", async (req, res) => {
  try {
    const email = req.params.email;

    const deletedUser = await User.findOneAndDelete({ email: email });

    if (!deletedUser) {
      return res.status(404).send("Utilisateur introuvable");
    }

    res.send("Utilisateur supprimé avec succès");
  } catch (error) {
    console.error(error);
    res.status(500).send("Erreur lors de la suppression de l'utilisateur");
  }
});

app.get("/test-delete-user", async (req, res) => {
  try {
    const deletedUser = await User.findOneAndDelete({
      email: "testuser@test.com",
    });

    if (!deletedUser) {
      return res.send("Utilisateur test introuvable");
    }

    res.send("Utilisateur supprimé avec succès");
  } catch (error) {
    console.error(error);
    res.send("Erreur lors de la suppression de l'utilisateur");
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email });

    if (!user) {
      return res.status(404).send("Utilisateur introuvable");
    }

    if (user.password !== password) {
      return res.status(401).send("Mot de passe incorrect");
    }

    res.send("Connexion réussie");
  } catch (error) {
    console.error(error);
    res.status(500).send("Erreur lors de la connexion");
  }
});

/**
 * Déconnecte l'utilisateur.
 * @route GET /logout
 * @returns {string}
 */
app.get("/logout", (req, res) => {
  res.send("Déconnexion réussie");
});

app.get("/dashboard", (req, res) => {
  res.render("pages/dashboard", { title: "Dashboard" });
});

  app.listen(PORT, () => {
    console.log(`Serveur lancé sur http://localhost:${PORT}`);
  });

})
  .catch((err) => console.error("Erreur MongoDB :", err));
