import { Users } from "./model.js";
import fs from "fs";
import https from "https";
import Jimp from "jimp";

export const emailInUse = (email) => Users.findOne({ email });

export const register = (email, password, avatarURL) =>
  Users.create({ email, password, avatarURL });

export const subscription = (id, { subscription }) =>
  Users.findByIdAndUpdate({ _id: id }, { subscription });

export const avatarUpdate = (id, { avatarURL }) =>
  Users.findByIdAndUpdate({ _id: id }, { avatarURL });

export const saveFile = (id, { avatarURL }) => {
  const tmpDir = "tmp";

  if (!fs.existsSync(tmpDir)) {
    fs.mkdirSync(tmpDir);
  }

  https
    .get(avatarURL, (response) => {
      const filePath = `${tmpDir}/${id}_avatar.jpg`;
      const file = fs.createWriteStream(filePath);
      response.pipe(file);
      file.on("finish", () => {
        file.close();
        console.log(`Avatar saved in ${filePath}`);

        Jimp.read(filePath, (err, avatar) => {
          if (err) throw err;

          avatar.resize(250, 250);

          const avatarName = `${id}_userAvatar.jpg`;
          const avatarDest = `public/avatars/${avatarName}`;

          avatar.write(avatarDest, () => {
            fs.unlink(filePath, (err) => {
              if (err) throw err;
              console.log(
                "Avatar został pomyślnie opracowany i zapisany w folderze avatars"
              );
            });
          });
        });
      });
    })
    .on("error", (err) => {
      console.error(`Error downloading avatar: ${err}`);
    });
};
