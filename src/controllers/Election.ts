import {Candidates,CategoryAndCandidates,Election,addIpandUserAgent,castVote,createElection, getElection, updateElectionStatus} from '../model/ElectionModel';
import { Schema } from 'mongoose';
import { NextFunction, Request,Response } from 'express';
import crypto from 'crypto';

function generateRandomString(length: number): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let randomString = '';

  for (let i = 0; i < length; i++) {
    const randomIndex = crypto.randomInt(0, chars.length);
    randomString += chars.charAt(randomIndex);
  }

  return randomString;
}

export const createElectionController = async (req:Request,res:Response) => {
    const ElectionData = req.body;
    req.body.ElectionStatus = "Pending";
    req.body.ElectionUrl = generateRandomString(6);
    
    createElection(req.body).then((data:any) => {
        res.status(200).json({"message":"Election created successfully"});
    }).catch((err) => {
        res.status(400).json({"message":"Error creating election","error":err});
    })
};

export const getElectionController = async (req:Request,res:Response) => {
    const electionUrl = req.params.electionUrl;
    getElection(electionUrl).then((data) => {
        res.status(200).json(data);
    }).catch((err) => {
        res.status(400).json({"message":"Error fetching election","error":err});
    })
};

export const castVoteController = async (req:Request,res:Response,next:NextFunction) => {
    const keys:String[] = Object.keys(req.body);
    const values:String[] = Object.values(req.body);
    if(keys.length === 0 ){
     res.status(400).json({"message":"Bad Api call"});
    }

    for(let i = 0; i < keys.length; i++){
        castVote(req.params.electionUrl, keys[i].toString(), values[i]).then((data) => {
           
        }).catch((err) => {
            res.status(400).json({"message":"Error casting vote","error":err});
        })
        addIpandUserAgent(req.ip,req.headers['user-agent'],req.params.electionUrl).then((data) => {
            
        }).catch((err) => {
            res.status(400).json({"message":"Error adding ip and user agent","error":err});
        })
    }
    next();
};

export const updateElectionStatusController = async (req:Request,res:Response) => {
    const electionUrl = req.params.electionUrl;
    const electionStatus = req.body.ElectionStatus;
    updateElectionStatus(electionUrl,electionStatus).then((data) => {
        res.status(200).json({"message":"Election status updated successfully"});
    }).catch((err) => {
        res.status(400).json({"message":"Error updating election status","error":err});
    })
};