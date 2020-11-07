require 'rails_helper'

describe Zipfile::CentralDirectory do

  let(:file_path) { 'test/fixtures/files/test.docx' }
      # NAME, COMPRESSED, UNCOMPRESSED
      # _rels/.rels, 232, 720
      # docProps/core.xml, 355, 676
      # docProps/app.xml, 319, 549
      # docProps/custom.xml, 241, 371
      # word/_rels/document.xml.rels, 259, 1060
      # word/document.xml, 2355, 19521
      # word/styles.xml, 926, 5983
      # word/media/image1.png, 916, 924
      # word/media/image2.png, 3206, 3227
      # word/numbering.xml, 854, 12287
      # word/fontTable.xml, 310, 1185
      # word/settings.xml, 266, 412
      # word/theme/theme1.xml, 1566, 7625
      # [Content_Types].xml, 393, 1885

  let(:central_directory) { 
    Zipfile::CentralDirectory.new(File.open(file_path).read)
  }

  it "instantiates from a complete archive string" do
    expect(central_directory).to be_an_instance_of(Zipfile::CentralDirectory)
  end

  it "instantiates with complete directory but incomplete string" do
    f = File.open(file_path)
    f.seek(f.size - 1000)
    central_directory2 = Zipfile::CentralDirectory.new(f.read)
    expect(central_directory2).to be_an_instance_of(Zipfile::CentralDirectory)
  end

  it "fails with truncated directory" do
    f = File.open(file_path)
    f.seek(f.size - 500)
    expect {
      central_directory2 = Zipfile::CentralDirectory.new(f.read)
    }.to raise_error(Zipfile::IncompleteCentralDirectory)
  end

  it "errors if no end_of_central_directory signature is found" do
  end

  it "calculates the total compressed size" do
    expect(central_directory.compressed_size).to eq(12198)
  end

  it "calculates the total uncompressed size" do
    expect(central_directory.uncompressed_size).to eq(56425)
  end

  it "has an EndOfCentralDirectory record" do
    expect(central_directory.end_record).to be_an_instance_of(Zipfile::EndOfCentralDirectory)
  end

  it "has the right number of file header records" do
    expect(central_directory.file_headers.size).to eq(central_directory.end_record.cd_records_total).and eq(14)
  end
  
end


