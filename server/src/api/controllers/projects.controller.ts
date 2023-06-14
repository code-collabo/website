import { Request, Response } from 'express';


import {
  createOneProjectService,
  getAllProjectsService,
  getOneProjectService,
  updateOneProjectService,
  deleteOneProjectService,
} from '../services/projects.service';

import { success, error } from '../../../node-mongo-helpers';
import { idDoesNotExist, useUrl } from '../../helpers/methods';
import { res, items } from '../../helpers/variables';

const { project } = items;
let response = res;



export const createOneProjectController = async (req: Request, res: Response) => {
  try {
    const doc = await createOneProjectService(req.body);
    response = {
      message: `${project} created successfully!`,
      project: {
        _id: doc._id,
        title: doc.title,
        url: doc.url,
        issue: doc.issue,
        img: doc.img,
        interest: doc.interest,
        skills: doc.skills,
        children: doc.children.map((child) => {
          return {
            _id: child._id,
            title: child.title,
            url: child.url,
            interest: child.interest,
            skills: child.skills,
          }
        }),
        requests: `Visit ${useUrl(req, doc._id, project).helpInfo} for help on how to make requests`
      },
    };
    success(`${project} CREATED successfully!`);
    return res.status(201).json(response);
  } catch (err) {
    error(`Error saving ${project}: ${err}`);
    res.status(500).json({
      error: `${err}`,
    });
  }
}



interface QueryObj {
  interest?: {$all: string[]};
  skills?: {$all: string[]};
}

export const getAllProjectsController = async (req: Request, res: Response) => {
  try {
    const {interest, skills} = req.query
    const queryObj : QueryObj = {};

    if(interest){
      queryObj.interest = {$all: (interest as string).split(',')};
    }
    if(skills){
      queryObj.skills = {$all: (skills as string).split(',')};
    }

    const docs = await getAllProjectsService(queryObj);
    response = {
      count: docs.length,
      projects: docs.map(doc => {
        return {
          _id: doc._id,
          title: doc.title,
          url: doc.url,
          issue: doc.issue,
          img: doc.img,
          interest: doc.interest,
          skills: doc.skills,
          children: {
            count: doc.children.length,
            list: doc.children.map((child) => {
              return {
                _id: child._id,
                title: child.title,
                url: child.url,
                interest: doc.interest,
                skills: doc.skills,
              }
            }),
          },
          requests: `Visit ${useUrl(req, doc._id, project).helpInfo} for help on how to make requests`
        }
      })
    };
    success(`GET request successful!`);
    return res.status(200).json(response);
  } catch (err) {
    error(`Error retriving ${project}s: ${err}`);
    res.status(500).json({
      error: `${err}`
    });
  }
}



export const getOneProjectController = async (req: Request, res: Response) => {
  try {
    const doc = await getOneProjectService(req.params.projectId);
    if (doc) {
      response = {
        _id: doc._id,
        title: doc.title,
        url: doc.url,
        issue: doc.issue,
        img: doc.img,
        interest: doc.interest,
        skills: doc.skills,
        children: doc.children.map((child) => {
          return {
            _id: child._id,
            title: child.title,
            url: child.url,
            interest: child.interest,
            skills: child.skills,
          }
        }),
        requests: `Visit ${useUrl(req, doc._id, project).helpInfo} for help on how to make requests`,
      };
      success(`GET request successful!`);
      return res.status(200).json(response);
    } else {
      error('No record found for provided ID');
      return res.status(404).json({
        message: 'No record found for provided ID',
      });
    }
  } catch (err) {
    error(`Error retriving ${project}s: ${err}`);
    res.status(500).json({
      error: `${err}`
    });
  }
}



export const updateOneProjectController = async (req: Request, res: Response) => {
  try {
    const doc = await updateOneProjectService(req.params.projectId, req.body);
    response = {
      message: `${project} updated successfully!`,
      project: {
        _id: doc._id,
        title: doc.title,
        url: doc.url,
        issue: doc.issue,
        img: doc.img,
        interest: doc.interest,
        skills: doc.skills,
        children: doc.children.map((child) => {
          return {
            _id: child._id,
            title: child.title,
            url: child.url,
            interest: child.interest,
            skills: child.skills,
          }
        }),
        requests: `Visit ${useUrl(req, doc._id, project).helpInfo} for help on how to make requests`
      },
    };
    success(`${project} UPDATED successfully!`);
    return res.status(201).json(response);
  } catch (err) {
    error(`Error retriving ${project}: ${err}`);
    res.status(500).json({
      message: 'Invalid ID',
      error: `${err}`,
    });
  }
}



export const deleteOneProjectController = async (req: Request, res: Response) => {
  try {
    const doc = await deleteOneProjectService(req.params.projectId);
    if (doc) {
      idDoesNotExist({
        res,
        req,
        item: project,
        statusCode: 200,
        message: `${project} deleted successfully! Get all ${project}s to find another ${project} id or create a new ${project}`,
      });
    } else {
      error('No record found for provided ID');
      idDoesNotExist({
        res,
        req,
        item: project,
        statusCode: 404,
        message: `No record found for provided ID, try getting all ${project}s to find a correct ${project} id or create a new ${project}`,
      });
    }
  } catch (err) {
    error(`Error deleting ${project}: ${err}`);
    idDoesNotExist({
      res,
      req,
      item: project,
      statusCode: 500,
      message: `Error deleting ${project}, try getting all ${project}s to find a valid ${project} id or create a new ${project}`,
    });
  }
};


/////////////////////////////////////////////////////
import {
  deleteAllProjectService,
} from '../services/projects.service';

export const deleteAllProjectController = async (req: Request, res: Response) => {
  try {
    const doc = await deleteAllProjectService();
    response = {
      message: `All ${doc.deletedCount} ${project} deleted successfully!`,
    };
    success(`All ${doc.deletedCount} ${project} deleted successfully!`);
    return res.status(201).json(response);
  } catch (err) {
    error(`Error Deleting All ${project}: ${err}`);
    res.status(500).json({
      message: `Error Deleting All ${project}`,
      error: `${err}`,
    });
  }
};
////////////////////////////////////////////////////////