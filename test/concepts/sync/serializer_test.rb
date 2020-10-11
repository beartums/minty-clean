
require 'test_helper'
require 'minitest/autorun'

ATTRIBUTES = %i[id name updated_at]

class TestModel 
  attr_accessor *ATTRIBUTES
  def self.attribute_names
    ATTRIBUTES.map(&:to_s)
  end
  def initialize(hash)
    @id = hash[:id]
    @name = hash[:name]
    @updated_at = hash[:updated_at]
  end
end

class TestModelSyncSerializer
  include Sync::Serializer
end

describe 'Serializer' do

  before do
    @expected_model_attributes = ATTRIBUTES.map(&:to_s)
    @expected_attributes_to_serialize = ATTRIBUTES
  end


  describe "For a stupid-simple serializer" do
    before do
      @test_sync_serializer = TestModelSyncSerializer.new('data')
    end
    
    it 'should fail without data' do
      assert_raises do
        TestModelSyncSerializer.new
      end
    end

    it "should use the inherited model class" do
      assert_equal "TestModel", @test_sync_serializer.model_name
      assert_equal TestModel, @test_sync_serializer.model_class
    end
 
    it "should pull attributes from active model" do
      assert_equal @expected_model_attributes.sort, @test_sync_serializer.model_attribute_names.sort
      assert_equal @expected_attributes_to_serialize.sort, @test_sync_serializer.attributes_to_serialize.keys.sort
    end
  end

  describe "for a complicated serializer with additional attributes" do
    before do
      class DifferentSyncSerializer
        include Sync::Serializer
        attributes  :name, :id
        attribute :deleted_at, type: :date
        model TestModel

        def created_at(object)
          'never' if object.name == 'First'
        end

        def deleted_at
          nil
        end

        def is_deleted 
          !deleted_at.nil?
        end
      end

      @different_sync_serializer = DifferentSyncSerializer.new('data')
      @expected_model_attributes = ATTRIBUTES.map(&:to_s)
      @expected_attributes_to_serialize = ATTRIBUTES +  %i[created_at deleted_at is_deleted] - %i[updated_at]
    end

    it "should use the proper model_class" do
      assert_equal TestModel, @different_sync_serializer.model_class
    end

    it "should expect to serialize only specified attributes if any specified" do
      assert_equal @expected_model_attributes.sort, @different_sync_serializer.model_attribute_names.sort
      assert_equal @expected_attributes_to_serialize.sort, @different_sync_serializer.attributes_to_serialize.keys.sort
    end

    describe "JSON output" do
      before do
        @data = [
          {id: 1, name: 'First', updated_at: 'yesterday'},
          {id: 2, name: 'Second', updated_at: 'today'}
        ]
        @model_data = @data.map {|row| TestModel.new(row)}
      end

      it "Should output json for simple serializer" do
        hash = TestModelSyncSerializer.new(@model_data).as_json
        assert hash == @data
      end
      it "Should output json for complex serializer" do
        expected_hash = [
          {:name=>"First", :id=>1, :deleted_at=>nil, :is_deleted=>false, :created_at=>"never"}, 
          {:name=>"Second", :id=>2, :deleted_at=>nil, :is_deleted=>false, :created_at=>nil}
        ]
        hash = DifferentSyncSerializer.new(@model_data).as_json
        assert hash == expected_hash
      end
    end
  end
end