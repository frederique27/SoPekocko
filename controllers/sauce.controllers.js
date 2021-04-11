const Sauce = require('../models/Sauce');
const fs = require('fs');

//routes GET
exports.getAllSauces = (req, res, next) => {
  Sauce.find()
    .then(sauce => res.status(200).json(sauce))
    .catch(error => res.status(400).json({ error }));
};
exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id }) //params = parametre de route dynamique
    .then(sauce => res.status(200).json(sauce))
    .catch(error => res.status(404).json({ error }));
};


//routes POST
exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id; //frontend renvoit un id qui n'est pas le bon
    const sauce = new Sauce({
      ...sauceObject, //opérateur spread va copier variable sauceObject
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    console.log(sauce)
    sauce.save()
      .then(() => res.status(201).json({ message: 'Sauce enregistrée !' }))
      .catch(error => res.status(400).json({ error }));
};
exports.likeSauce = (req, res, next) => {
  switch (req.body.like) {
    case 0:                                                   //cas: req.body.like = 0
      Sauce.findOne({ _id: req.params.id })
        .then((sauce) => {
          if (sauce.usersLiked.find( user => user === req.body.userId)) {  // on cherche si l'utilisateur est déjà dans le tableau usersLiked
            Sauce.updateOne({ _id: req.params.id }, {         // si oui, on va mettre à jour la sauce avec le _id présent dans la requête
              $inc: { likes: -1 },                            // on décrémente la valeur des likes de 1 (soit -1)
              $pull: { usersLiked: req.body.userId }          // on retire l'utilisateur du tableau.
            })
              .then(() => { res.status(201).json({ message: "vote enregistré."}); })
              .catch((error) => { res.status(400).json({error}); });

          } 
          if (sauce.usersDisliked.find(user => user === req.body.userId)) {  //mêmes principes que précédemment avec le tableau usersDisliked
            Sauce.updateOne({ _id: req.params.id }, {
              $inc: { dislikes: -1 },
              $pull: { usersDisliked: req.body.userId }
            })
              .then(() => { res.status(201).json({ message: "vote enregistré." }); })
              .catch((error) => { res.status(400).json({error}); });
          }
        })
        .catch((error) => { res.status(404).json({error}); });
      break;
    
    case 1:                                                 //cas: req.body.like = 1
      Sauce.updateOne({ _id: req.params.id }, {             // on recherche la sauce avec le _id présent dans la requête
        $inc: { likes: 1 },                                 // incrémentaton de la valeur de likes par 1.
        $push: { usersLiked: req.body.userId }              // on ajoute l'utilisateur dans le array usersLiked.
      })
        .then(() => { res.status(201).json({ message: "vote enregistré." }); })
        .catch((error) => { res.status(400).json({ error }); });
      break;
    
    case -1:                                                  //cas: req.body.like = 1
      Sauce.updateOne({ _id: req.params.id }, {               // on recherche la sauce avec le _id présent dans la requête
        $inc: { dislikes: 1 },                                // on décremente de 1 la valeur de dislikes.
        $push: { usersDisliked: req.body.userId }             // on rajoute l'utilisateur à l'array usersDiliked.
      })
        .then(() => { res.status(201).json({ message: "vote enregistré." }); })
        .catch((error) => { res.status(400).json({ error }); }); 
      break;
    default:
      console.error("bad request");
  }
};


//routes PUT
exports.modifySauce = (req, res, next) => {
  const sauceObject = req.file ? // ? = remplace if/else. si req.file existe {} sinon : {}
    {
      ...JSON.parse(req.body.sauce),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };
  Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Sauce modifiée !'}))
    .catch(error => res.status(400).json({ error }));
};


//routes DELETE
exports.deleteSauce = (req, res, next) => {
	Sauce.findOne({ _id: req.params.id })
	  .then(sauce => {
		const filename = sauce.imageUrl.split('/images/')[1]; //récupère 2e élément du tableau (nom du fichier)
		fs.unlink(`images/${filename}`, () => { //unlink = supprime un fichier
		  Sauce.deleteOne({ _id: req.params.id }) //ensuite supprime de la base de donnée
			.then(() => res.status(200).json({ message: 'Sauce supprimé !' }))
			.catch(error => res.status(400).json({ error }));
		});
	  })
	  .catch(error => res.status(500).json({ error }));
  };





