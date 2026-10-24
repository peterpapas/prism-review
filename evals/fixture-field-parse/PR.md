# PR: validate uploaded image dimensions

The first push replaced numeric conversion with `parseInt` and added a range check.
A review draft was written against that push. The final push validates the entire
input token before parsing. Assess the draft against its original and current heads.
