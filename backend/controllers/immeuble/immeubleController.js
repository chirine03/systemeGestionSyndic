import { getListeImmeuble, matriculeExiste1, immeubleExiste, deleteImmeuble, addImmeuble, matriculeExiste2, updateImmeuble} from "../../models/immeuble/immeubleModel.js";

export const listeImmeubles = async (req, res) => {
  try {
    const immeubles = await getListeImmeuble();
    return res.json({ success: true, data: immeubles });
  } catch (error) {
    console.error("Erreur lors de la récupération des immeubles :", error);
    return res.status(500).json({ success: false, message: 'Erreur serveur.' });
  }
};

export const suppImmeuble = async (req, res) => {
  const { id_immeuble } = req.body;

  try {
    const existe = await immeubleExiste(id_immeuble);

    if (existe) {
      return res.status(400).json({
        success: false,
        message: "Impossible de supprimer : l'immeuble est lié à des appartements.",
      });
    }

    const deleted = await deleteImmeuble(id_immeuble);

    if (deleted) {
      return res.json({
        success: true,
        message: "Immeuble supprimé avec succès."});
    }else {
      return res.status(404).json({
        success: false,
        message: "Immeuble non trouvé."
      });
    }

  } catch (error) {
    console.error("Erreur serveur :", error);
    return res.status(500).json({success: false, message: "Erreur serveur."});
  }
};


export const ajouterImmeuble = async (req, res) => {
  const { raison_sociale, matricule, adresse, nbr_etage, bloc, description } = req.body;

  try {
    const existe = await matriculeExiste1(matricule);

    if (existe) {
      return res.status(400).json({
        success: false,
        message: "Le matricule existe déjà.",
      });
    }

    const id_immeuble = await addImmeuble({ raison_sociale, matricule, adresse, nbr_etage, bloc, description });

    return res.json({
      success: true,
      message: "Immeuble ajouté avec succès.",
      id_immeuble,
    });
  } catch (error) {
    console.error("Erreur serveur :", error);
    return res.status(500).json({ success: false, message: "Erreur serveur." });
  }
};

export const modifierImmeuble = async (req, res) => {
  const { id_immeuble, raison_sociale, matricule, adresse, nbr_etage, bloc, description } = req.body;

  try {
    const mat = await matriculeExiste2(id_immeuble);

    if (mat != matricule) {
      const existe = await matriculeExiste1(matricule);
      if (existe) {
        return res.status(400).json({
          success: false,
          message: "Le matricule existe déjà.",
        });
      }
    }
    const updated = await updateImmeuble(id_immeuble, { raison_sociale, matricule, adresse, nbr_etage, bloc, description });

    if (updated) {
      return res.json({
        success: true,
        message: "Immeuble modifié avec succès.",
      });
    } else {
      return res.status(404).json({
        success: false,
        message: "Immeuble non trouvé.",
      });
    }
  } catch (error) {
    console.error("Erreur serveur :", error);
    return res.status(500).json({ success: false, message: "Erreur serveur." });
  }
};