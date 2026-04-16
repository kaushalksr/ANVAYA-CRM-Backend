const { initializeDatabase } = require("./db/db.connect");
const express = require("express");
const cors = require("cors");
const corsOptions = {
  origin: "*",
  credentials: true,
};

const app = express();
app.use(cors(corsOptions));
app.use(express.json());

const Lead = require("./models/lead.model");
const SalesAgent = require("./models/salesAgent.model");
const Comment = require("./models/comment.model");
const Tag = require("./models/tag.model");

initializeDatabase();

// TO ADD LEAD

async function addLead(newLead) {
  try {
    const lead = new Lead(newLead);
    const savedLead = await lead.save();
    return savedLead;
  } catch (error) {
    console.log(error);
  }
}

app.post("/leads", async (req, res) => {
  try {
    const lead = await addLead(req.body);
    if (lead) {
      res.status(200).json({ message: "Lead added succesfully!" });
    } else {
      res.status(500).json({ message: "Failed to add Lead..." });
    }
  } catch (error) {
    res.status(404).json({ error: "Error ocurred..." });
    console.log(error);
  }
});

// TO READ ALL LEADS

async function readAllLeads() {
  try {
    const allLeads = await Lead.find();
    return allLeads;
  } catch (error) {
    console.log(error);
  }
}

app.get("/leads", async (req, res) => {
  try {
    const allLeads = await readAllLeads();
    if (allLeads) {
      res.json(allLeads);
    } else {
      res.status(404).json({ message: "Failed to fetch  Leads!" });
    }
  } catch (error) {
    res.status(500).json({ error: "Error ocurred while fetching Leads!" });
  }
});

// UPDATE LEAD BY ID

async function updateLeadById(leadId, dataToUpdate) {
  try {
    const lead = await Lead.findByIdAndUpdate(leadId, dataToUpdate, {
      new: true,
    });
    return lead;
  } catch (error) {
    console.log(error);
  }
}

app.put("/leads/:leadId", async (req, res) => {
  try {
    const lead = await updateLeadById(req.params.leadId, req.body);
    if (lead) {
      res.json(lead);
    } else {
      res.status(404).json({ message: "Lead not Found!" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to Update Lead!" });
  }
});

// DELETE LEAD BY ID

async function deleteLeadById(leadId) {
  try {
    const lead = await Lead.findByIdAndDelete(leadId);
    return lead;
  } catch (error) {
    console.log(error);
  }
}

app.delete("/leads/:leadId", async (req, res) => {
  try {
    const lead = await deleteLeadById(req.params.leadId);
    if (lead) {
      res.json({
        message: "Lead deleted Sucessfully!",
        deletedLead: lead,
      });
    } else {
      res.status(404).json({ message: "Lead Does not exist!" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to Delete Lead!" });
  }
});

// ADD NEW SALES AGENT

async function addSalesAgent(newSalesAgent) {
  try {
    const salesAgent = new SalesAgent(newSalesAgent);
    const savedAgent = await salesAgent.save();
    return savedAgent;
  } catch (error) {
    console.log(error);
  }
}

app.post("/agents", async (req, res) => {
  try {
    const salesAgents = await addSalesAgent(req.body);
    if (salesAgents) {
      res.status(200).json({ message: "Sales agent added succesfully!" });
    } else {
      res.status(500).json({ message: "Failed to add sales agent..." });
    }
  } catch (error) {
    res.status(404).json({ error: "Error ocurred..." });
    console.log(error);
  }
});

// READ ALL SALES AGENTS

async function readAllAgents() {
  try {
    const allAgents = await SalesAgent.find();
    return allAgents;
  } catch (error) {
    console.log(error);
  }
}

app.get("/agents", async (req, res) => {
  try {
    const allAgents = await readAllAgents();
    if (allAgents) {
      res.json(allAgents);
    } else {
      res.status(404).json({ message: "Failed to fetch Sales  Agents!" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error ocurred while fetching Sales Agents!" });
  }
});

// DELETE SALES AGENT

async function deleteSalesAgentById(agentId) {
  try {
    const agent = await SalesAgent.findByIdAndDelete(agentId);
    return agent;
  } catch (error) {
    console.log(error);
  }
}

app.delete("/agents/:agentId", async (req, res) => {
  
  try {
    const agent = await deleteSalesAgentById(req.params.agentId);
    if (agent) {
      res.json({
        message: "Agent deleted Sucessfully!",
        deletedAgent: agent,
      });
    } else {
      res.status(404).json({ message: "Agent Does not exist!" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to Delete Agent!" });
  }
});

// ADD COMMENT

async function addComment(newComment) {
  try {
    const comment = new Comment(newComment);
    const savedComment = await comment.save();
    return savedComment;
  } catch (error) {
    console.log(error);
  }
}

app.post("/leads/:leadId/comments", async (req, res) => {
  try {
    const comment = await addComment(req.body);
    console.log("Comment = ", comment);
    if (comment) {
      res.status(200).json({ message: "Comment added succesfully!" });
    } else {
      res.status(500).json({ message: "Failed to add comment..." });
    }
  } catch (error) {
    res.status(404).json({ error: "Error ocurred..." });
    console.log(error);
  }
});

// READ ALL COMMENTS FOR LEAD

async function readAllCommentsOfLead(leadId) {
  try {
    const allComments = await Comment.find({ lead: leadId });
    return allComments;
  } catch (error) {
    console.log(error);
  }
}

app.get("/leads/:leadId/comments", async (req, res) => {
  try {
    const allComments = await readAllCommentsOfLead(req.params.leadId);
    if (allComments.length === 0) {
      res.status(404).json({ message: "No comments found for this lead." });
    } else if (allComments) {
      res.json(allComments);
    } else {
      res.status(500).json({ message: "Failed to fetched comment..." });
    }
  } catch (error) {
    res.status(404).json({ error: "Error ocurred..." });
    console.log(error);
  }
});

// ADD NEW TAG

async function addNewTag(newTag) {
  try {
    const tag = new Tag(newTag);
    const savedTag = await tag.save();
    return savedTag;
  } catch (error) {
    console.log(error);
  }
}

app.post("/tags", async (req, res) => {
  try {
    const tag = await addNewTag(req.body);
    if (tag) {
      res.status(200).json({ message: "Tag Created SUCCESFULLY!" });
    } else {
      res.status(500).json({ message: "Failed to create new Tag." });
    }
  } catch (error) {
    res.status(404).json({ error: "Error ocurred..." });
    console.log(error);
  }
});

// READ ALL TAGS

async function readAllTags() {
  try {
    const allTags = await Tag.find();
    return allTags;
  } catch (error) {
    console.log(error);
  }
}

app.get("/tags", async (req, res) => {
  try {
    const allTags = await readAllTags();
    if (allTags) {
      res.json(allTags);
    } else {
      res.status(500).json({ message: "Failed to fetched Tag." });
    }
  } catch (error) {
    res.status(404).json({ error: "Error ocurred..." });
    console.log(error);
  }
});

// PORT = 3000;
// app.listen(PORT, () => {
//   console.log(`Server running on ${PORT}`);
// });

module.exports = app;
