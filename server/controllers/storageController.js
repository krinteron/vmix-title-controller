import { PrismaClient } from '@prisma/client';
// const fs = require('fs');

const prisma = new PrismaClient();

exports.get_programs = async function (req, res) {
  let programs;
  const { id } = req.params;
  if (id) {
    programs = await prisma.program.findUnique({
      where: {
        id: Number(id),
      },
    });
  } else {
    programs = await prisma.program.findMany({
      include: { components: true },
    });
  }
  res.json({ programs });
};

exports.post_programs = async function (req, res) {
  const { name } = req.body;
  const post = await prisma.program.create({
    data: {
      name,
    },
  });
  res.status(200).json(post);
};

exports.get_components = async function (req, res) {
  let components;
  const { id } = req.params;
  if (id) {
    components = await prisma.component.findUnique({
      where: {
        id: Number(id),
      },
    });
  } else {
    components = await prisma.component.findMany({
      include: { columns: true },
    });
  }
  res.json({ components });
};

exports.post_components = async function (req, res) {
  const { name, programId } = req.body;
  const post = await prisma.component.create({
    data: {
      name,
      programId,
    },
  });
  res.status(200).json(post);
};

exports.get_columns = async function (req, res) {
  let columns;
  const { id } = req.params;
  if (id) {
    columns = await prisma.column.findUnique({
      where: {
        id: Number(id),
      },
    });
  } else {
    columns = await prisma.column.findMany();
  }
  res.json({ columns });
};

exports.post_columns = async function (req, res) {
  const { name, componentId, filename, autoclose, uppercase, overlayNumber } =
    req.body;
  const post = await prisma.column.create({
    data: {
      name,
      componentId,
      filename,
      autoclose,
      uppercase,
      overlayNumber,
    },
  });
  res.status(200).json(post);
};
